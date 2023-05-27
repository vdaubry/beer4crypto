// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "hardhat/console.sol";

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
    mapping(bytes32 groupId => mapping(address memberAddress => Member)) private groupToMembers;
    mapping(bytes32 eventId => mapping(uint256 eventDate => GroupEvent)) private eventToGroups;
    mapping(bytes32 eventId => mapping(address memberAddress => Bet)) private betToEvents;

    event GroupCreated(string name, bytes32 id);
    event MemberInvited(bytes32 groupId, address memberAddress, string nickname);
    event EventCreated(
        bytes32 eventId,
        address creator,
        uint256 eventDate,
        uint256 minDeposit,
        bytes32 groupId,
        uint256 maxBetDate
    );
    event BetCreated(
        address creator,
        bytes32 groupId,
        uint256 amountDeposited,
        uint256 predictedEthPrice,
        uint256 eventId
    );

    modifier onlyMember(bytes32 groupId) {
        require(isMember(groupId, msg.sender), "Caller not a group member");
        _;
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

    function createEvent(
        uint256 eventDate,
        uint256 minDeposit,
        bytes32 groupId,
        uint256 maxBetDate
    ) public onlyMember(groupId) {
        require(eventDate > block.timestamp, "Event date must be in the future");
        require(eventDate > maxBetDate, "Event date after max bet date");
        require(eventToGroups[groupId][eventDate].id == 0, "Event already exists");

        bytes32 eventId = keccak256(abi.encodePacked(groupId, eventDate));

        GroupEvent memory groupEvent = GroupEvent(
            eventId,
            msg.sender,
            eventDate,
            minDeposit,
            false,
            groupId,
            maxBetDate,
            0
        );
        eventToGroups[groupId][eventDate] = groupEvent;

        emit EventCreated(eventId, msg.sender, eventDate, minDeposit, groupId, maxBetDate);
    }

    // function createBet(
    //     address creator,
    //     uint256 betDate,
    //     uint256 predictedEthPrice,
    //     bytes32 everntId
    // ) public payable onlyMember(groupId) {
    //     Event event =
    //     require(betDate > block.timestamp, "Bet date must be in the future");
    // }

    function inviteMember(
        address memberAddress,
        string memory memberNickname,
        bytes32 groupId
    ) public onlyMember(groupId) {
        Member memory member = Member(memberAddress, memberNickname);
        groupToMembers[groupId][memberAddress] = member;

        emit MemberInvited(groupId, memberAddress, memberNickname);
    }

    function isMember(bytes32 groupId, address member) public view returns (bool) {
        return groupToMembers[groupId][member].memberAddress != address(0);
    }

    function getGroupEvent(
        bytes32 groupId,
        uint256 eventDate
    ) public view returns (GroupEvent memory) {
        return eventToGroups[groupId][eventDate];
    }
}
