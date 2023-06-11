// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../node_modules/hardhat/console.sol";

contract Beer4Crypto {
  enum BetStatus {
    PENDING,
    LOST,
    WON
  }

  struct GroupEvent {
    bytes32 id;
    address creator;
    uint256 eventDate;
    uint256 minDeposit;
    bool ended;
    bytes32 groupId;
    uint256 maxBetDate;
    uint256 actualEthPrice;
  }

  struct Bet {
    address creator;
    uint256 betDate;
    uint256 predictedEthPrice;
    uint256 amountDeposited;
    BetStatus status;
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

  AggregatorV3Interface private priceFeed;

  event GroupCreated(string name, bytes32 id);
  event MemberInvited(bytes32 groupId, address memberAddress, string nickname);
  event GroupEventCreated(
    bytes32 id,
    address creator,
    uint256 eventDate,
    uint256 minDeposit,
    bool ended,
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
    bool ended = false;
    GroupEvent memory groupEvent = GroupEvent(
      eventId,
      msg.sender,
      eventDate,
      minDeposit,
      ended,
      groupId,
      maxBetDate,
      0
    );
    groupEvents[eventId] = groupEvent;
    eventToGroups[groupId][eventDate] = eventId;

    emit GroupEventCreated(eventId, msg.sender, eventDate, minDeposit, ended, groupId, maxBetDate);
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

  function createBet(bytes32 eventId, uint256 predictedEthPrice) public payable {
    GroupEvent memory groupEvent = groupEvents[eventId];
    require(groupEvent.id != 0, "Event does not exist");
    require(isMember(groupEvent.groupId, msg.sender), "Caller not a group member");
    require(groupEvent.maxBetDate > block.timestamp, "Bets are closed");
    require(msg.value >= groupEvent.minDeposit, "Min Bet amount is not met");
    require(betToEvents[groupEvent.id][msg.sender].creator == address(0), "Bet already exists");

    Bet memory bet = Bet(
      msg.sender,
      block.timestamp,
      predictedEthPrice,
      msg.value,
      BetStatus.PENDING,
      groupEvent.id
    );
    betToEvents[groupEvent.id][msg.sender] = bet;

    emit BetCreated(
      msg.sender,
      block.timestamp,
      predictedEthPrice,
      msg.value,
      groupEvent.id,
      groupEvent.groupId
    );
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
}
