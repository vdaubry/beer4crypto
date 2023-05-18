// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract Beer4Crypto {
    struct Event {
        address creator;
        uint256 eventDate;
        uint256 minDeposit;
        bool ended;
        bytes32 groupid;
        uint256 maxBetDate;
        uint256 actualEthPrice;
    }

    struct MemberBet {
        address member;
        uint256 betDate;
        uint256 predictedEthPrice;
    }

    struct Group {
        bytes32 id;
        string name;
    }

    struct Member {
        address memberAddress;
        string nickname;
    }

    mapping(bytes32 => Member[]) private groupMembers;
    mapping(bytes32 => Event[]) private groupEvents;
    mapping(address => Group[]) private memberGroups;
    mapping(uint256 => MemberBet[]) private eventMemberBets;

    event GroupCreated(string name, bytes32 id);
    event MemberInvited(
        bytes32 groupId,
        address memberAddress,
        string nickname
    );
    event BetCreated(
        address creator,
        uint256 pickWinnerDate,
        uint256 minDeposit,
        bytes32 groupid,
        uint256 maxBetDateInterval
    );

    modifier onlyMember(bytes32 groupId) {
        require(
            isMember(groupId, msg.sender),
            "Only members can call this function"
        );
        _;
    }

    function createGroup(
        string memory groupName,
        string memory nickname
    ) public {
        bytes32 groupId = keccak256(
            abi.encodePacked(
                groupName,
                block.timestamp,
                blockhash(block.number)
            )
        );
        Group memory group = Group(groupId, groupName);
        Member memory member = Member(msg.sender, nickname);

        memberGroups[msg.sender].push(group);
        groupMembers[groupId].push(member);

        emit GroupCreated(groupName, groupId);
    }

    function isMember(
        bytes32 groupId,
        address member
    ) public view returns (bool) {
        Member[] memory members = groupMembers[groupId];

        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].memberAddress == member) {
                return true;
            }
        }

        return false;
    }

    function listGroupsForMember(
        address member
    ) public view returns (Group[] memory) {
        return memberGroups[member];
    }

    function listMembersForGroup(
        bytes32 id
    ) public view returns (Member[] memory) {
        return groupMembers[id];
    }

    function inviteMember(
        address memberAddress,
        string memory memberNickname,
        bytes32 groupId
    ) public onlyMember(groupId) {
        Member memory member = Member(memberAddress, memberNickname);
        groupMembers[groupId].push(member);

        emit MemberInvited(groupId, memberAddress, memberNickname);
    }

    function createEvent(
        uint256 eventDate,
        uint256 minDeposit,
        bytes32 groupid,
        uint256 maxBetDate
    ) public onlyMember(groupid) {
        Event memory event_ = Event(
            msg.sender,
            eventDate,
            minDeposit,
            false,
            groupid,
            maxBetDate,
            0
        );
        groupEvents[groupid].push(event_);

        emit EventCreated(
            msg.sender,
            eventDate,
            minDeposit,
            groupid,
            maxBetDate
        );
    }
}
