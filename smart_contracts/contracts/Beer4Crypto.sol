// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../node_modules/hardhat/console.sol";

contract Beer4Crypto {
  struct GroupEvent {
    bytes32 id;
    address creator;
    uint256 eventDate;
    uint256 minDeposit;
    bytes32 groupId;
    uint256 maxBetDate;
    uint256 actualEthPrice;
    address winner;
    uint256 totalAmountDeposited;
  }

  struct Bet {
    address creator;
    uint256 betDate;
    uint256 predictedEthPrice;
    uint256 amountDeposited;
    bytes32 eventId;
  }

  struct Group {
    bytes32 id;
    string name;
  }

  struct Member {
    address memberAddress;
    string nickname;
  }

  mapping(bytes32 groupId => Group) private groups;
  mapping(bytes32 eventId => GroupEvent) private groupEvents;
  mapping(bytes32 groupId => mapping(address memberAddress => Member)) private groupToMembers;
  mapping(bytes32 groupId => mapping(uint256 eventDate => bytes32 eventId)) private eventToGroups;
  mapping(bytes32 eventId => mapping(address memberAddress => Bet)) private betToEvents;
  mapping(bytes32 eventId => Bet[]) private eventBets;

  AggregatorV3Interface private priceFeed;

  event GroupCreated(string name, bytes32 id);
  event MemberInvited(bytes32 groupId, address memberAddress, string nickname);
  event GroupEventCreated(
    bytes32 id,
    address creator,
    uint256 eventDate,
    uint256 minDeposit,
    bytes32 groupId,
    uint256 maxBetDate
  );
  event BetCreated(
    address creator,
    uint256 betDate,
    uint256 predictedEthPrice,
    uint256 amountDeposited,
    bytes32 eventId,
    bytes32 groupId
  );

  modifier onlyMember(bytes32 groupId) {
    require(isMember(groupId, msg.sender), "Caller not a group member");
    _;
  }

  modifier eventNotEnded(bytes32 eventId) {
    require(groupEvents[eventId].eventDate < block.timestamp, "Event has not ended yet");
    _;
  }

  constructor(address priceFeedAddress) {
    priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  function createGroup(string memory groupName, string memory nickname) public {
    bytes32 groupId = keccak256(
      abi.encodePacked(groupName, block.timestamp, blockhash(block.number))
    );
    Group memory group = Group(groupId, groupName);
    Member memory member = Member(msg.sender, nickname);

    groups[groupId] = group;
    groupToMembers[groupId][msg.sender] = member;

    emit GroupCreated(groupName, groupId);
    emit MemberInvited(groupId, msg.sender, nickname);
  }

  function createGroupEvent(
    uint256 eventDate,
    uint256 minDeposit,
    bytes32 groupId,
    uint256 maxBetDate
  ) public onlyMember(groupId) {
    require(eventDate > block.timestamp, "Event date must be in the future");
    require(eventDate > maxBetDate, "Event date after max bet date");
    require(eventToGroups[groupId][eventDate] == 0, "Event already exists");

    bytes32 eventId = keccak256(abi.encodePacked(groupId, eventDate));
    GroupEvent memory groupEvent = GroupEvent(
      eventId,
      msg.sender,
      eventDate,
      minDeposit,
      groupId,
      maxBetDate,
      0,
      address(0),
      0
    );
    groupEvents[eventId] = groupEvent;
    eventToGroups[groupId][eventDate] = eventId;

    emit GroupEventCreated(eventId, msg.sender, eventDate, minDeposit, groupId, maxBetDate);
  }

  function inviteMember(
    address memberAddress,
    string memory memberNickname,
    bytes32 groupId
  ) public onlyMember(groupId) {
    Member memory member = Member(memberAddress, memberNickname);
    groupToMembers[groupId][memberAddress] = member;

    emit MemberInvited(groupId, memberAddress, memberNickname);
  }

  function createBet(
    bytes32 eventId,
    uint256 predictedEthPrice
  ) public payable onlyMember(groupEvents[eventId].groupId) {
    GroupEvent storage groupEvent = groupEvents[eventId];
    require(groupEvent.maxBetDate > block.timestamp, "Bets are closed");
    require(msg.value >= groupEvent.minDeposit, "Min Bet amount is not met");
    require(betToEvents[groupEvent.id][msg.sender].creator == address(0), "Bet already exists");

    Bet memory bet = Bet(msg.sender, block.timestamp, predictedEthPrice, msg.value, groupEvent.id);
    betToEvents[groupEvent.id][msg.sender] = bet;
    eventBets[groupEvent.id].push(bet);
    groupEvent.totalAmountDeposited += msg.value;

    emit BetCreated(
      msg.sender,
      block.timestamp,
      predictedEthPrice,
      msg.value,
      groupEvent.id,
      groupEvent.groupId
    );
  }

  function withdraw(
    bytes32 eventId
  ) public onlyMember(groupEvents[eventId].groupId) eventNotEnded(eventId) {
    GroupEvent memory groupEvent = groupEvents[eventId];
    require(groupEvent.id != 0, "Event does not exist");
    require(betToEvents[groupEvent.id][msg.sender].creator != address(0), "Bet does not exist");
    require(groupEvent.winner == msg.sender, "Caller is not the winner");

    Bet memory bet = betToEvents[groupEvent.id][msg.sender];
    uint256 amount = bet.amountDeposited;
  }

  function pickWinner(
    bytes32 eventId
  ) public onlyMember(groupEvents[eventId].groupId) eventNotEnded(eventId) {
    GroupEvent memory groupEvent = groupEvents[eventId];
    require(groupEvent.id != 0, "Event does not exist");

    if (groupEvent.winner != address(0)) {
      return;
    }

    uint256 ethPrice = getPrice();
    Bet[] memory bets = eventBets[groupEvent.id];
    Bet memory currentClosestBet = bets[0];
    for (uint256 i = 0; i < bets.length; i++) {
      if (
        abs(int256(bets[i].predictedEthPrice - ethPrice)) <
        abs(int256(currentClosestBet.predictedEthPrice - ethPrice))
      ) {
        currentClosestBet = bets[i];
      }
    }

    groupEvent.winner = currentClosestBet.creator;
  }

  function getPrice() internal view returns (uint256) {
    (, int256 answer, , , ) = priceFeed.latestRoundData();
    return uint256(answer * 1e10); // 1* 10 ** 10 == 10000000000
  }

  function isMember(bytes32 groupId, address member) public view returns (bool) {
    return groupToMembers[groupId][member].memberAddress != address(0);
  }

  function getGroupEvent(
    bytes32 groupId,
    uint256 eventDate
  ) public view returns (GroupEvent memory) {
    bytes32 eventId = eventToGroups[groupId][eventDate];
    return groupEvents[eventId];
  }

  function getBet(bytes32 eventId, address memberAddress) public view returns (Bet memory) {
    return betToEvents[eventId][memberAddress];
  }

  function getGroup(bytes32 groupId) public view returns (Group memory) {
    return groups[groupId];
  }

  function abs(int256 a) internal pure returns (uint256) {
    return a < 0 ? uint256(-a) : uint256(a);
  }
}
