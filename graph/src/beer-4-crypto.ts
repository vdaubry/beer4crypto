import { log } from "@graphprotocol/graph-ts";
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import {
  GroupCreated as GroupCreatedEvent,
  MemberInvited as MemberInvitedEvent,
  GroupEventCreated as GroupEventCreatedEvent,
  BetCreated as BetCreatedEvent,
} from "../generated/Beer4Crypto/Beer4Crypto";
import { Group, Member, GroupEvent, Bet } from "../generated/schema";

export function handleGroupCreated(event: GroupCreatedEvent): void {
  let group = Group.load(event.params.id);

  if (!group) {
    group = new Group(event.params.id);
  }

  group.name = event.params.name;
  group.blockNumber = event.block.number;
  group.blockTimestamp = event.block.timestamp;
  group.transactionHash = event.transaction.hash;

  group.save();
}

export function handleMemberInvited(event: MemberInvitedEvent): void {
  let memberId = getMemberIdFromParams(
    event.params.groupId,
    event.params.memberAddress
  );
  let member = Member.load(memberId);

  if (!member) {
    member = new Member(memberId);
  }

  member.group = event.params.groupId;
  member.memberAddress = event.params.memberAddress;
  member.nickname = event.params.nickname;

  member.blockNumber = event.block.number;
  member.blockTimestamp = event.block.timestamp;
  member.transactionHash = event.transaction.hash;

  member.save();
}

export function handleGroupEventCreated(event: GroupEventCreatedEvent): void {
  let groupEvent = GroupEvent.load(event.params.id);

  if (!groupEvent) {
    groupEvent = new GroupEvent(event.params.id);
  }

  groupEvent.creator = getMemberIdFromParams(
    event.params.groupId,
    event.params.creator
  );
  groupEvent.eventDate = event.params.eventDate;
  groupEvent.minDeposit = event.params.minDeposit;
  groupEvent.group = event.params.groupId;
  groupEvent.maxBetDate = event.params.maxBetDate;

  groupEvent.blockNumber = event.block.number;
  groupEvent.blockTimestamp = event.block.timestamp;
  groupEvent.transactionHash = event.transaction.hash;

  groupEvent.save();
}

export function handleBetCreated(event: BetCreatedEvent): void {
  log.info("Index new Bet for event: {}", [event.params.eventId.toHexString()]);
  let betId = getBetIdFromParams(event.params.eventId, event.params.creator);
  let bet = Bet.load(betId);

  if (!bet) {
    bet = new Bet(betId);
  }

  bet.creator = getMemberIdFromParams(
    event.params.groupId,
    event.params.creator
  );
  bet.betDate = event.params.betDate;
  bet.amountDeposited = event.params.amountDeposited;
  bet.predictedEthPrice = event.params.predictedEthPrice;
  bet.groupEvent = event.params.eventId;

  bet.blockNumber = event.block.number;
  bet.blockTimestamp = event.block.timestamp;
  bet.transactionHash = event.transaction.hash;

  bet.save();
}

function getMemberIdFromParams(groupId: Bytes, memberAddress: Address): Bytes {
  return groupId.concat(memberAddress as Bytes);
}

function getBetIdFromParams(eventId: Bytes, memberAddress: Address): Bytes {
  return Bytes.fromHexString(
    eventId.toHexString() + memberAddress.toHexString()
  );
}
