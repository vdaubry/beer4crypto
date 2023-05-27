import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  BetCreated as BetCreatedEvent,
  EventCreated as EventCreatedEvent,
  GroupCreated as GroupCreatedEvent,
  MemberInvited as MemberInvitedEvent
} from "../generated/Beer4Crypto/Beer4Crypto"
import {
  BetCreated,
  EventCreated,
  GroupCreated,
  MemberInvited
} from "../generated/schema"

export function handleBetCreated(event: BetCreatedEvent): void {
  let betCreatedId = getBetCreatedIdFromParams(event.params.eventId, event.params.creator)
  let betCreated = BetCreated.load(betCreatedId)

  if(!betCreated) {
    betCreated = new BetCreated(
      betCreatedId
    ) 
  }

  betCreated.creator = event.params.creator
  betCreated.groupId = event.params.groupId
  betCreated.amountDeposited = event.params.amountDeposited
  betCreated.predictedEthPrice = event.params.predictedEthPrice
  betCreated.eventId = event.params.eventId

  betCreated.blockNumber = event.block.number
  betCreated.blockTimestamp = event.block.timestamp
  betCreated.transactionHash = event.transaction.hash

  betCreated.save()
}

export function handleEventCreated(event: EventCreatedEvent): void {
  let eventCreatedId = getEventCreatedIdFromParams(event.params.groupId, event.params.eventDate)
  let eventCreated = EventCreated.load(eventCreatedId)

  if(!eventCreated) {
    eventCreated = new EventCreated(
      eventCreatedId
    ) 
  }
  
  eventCreated.creator = event.params.creator
  eventCreated.eventDate = event.params.eventDate
  eventCreated.minDeposit = event.params.minDeposit
  eventCreated.groupId = event.params.groupId
  eventCreated.maxBetDate = event.params.maxBetDate

  eventCreated.blockNumber = event.block.number
  eventCreated.blockTimestamp = event.block.timestamp
  eventCreated.transactionHash = event.transaction.hash

  eventCreated.save()
}

export function handleGroupCreated(event: GroupCreatedEvent): void {
  let group = GroupCreated.load(event.params.id)

  if (!group) {
    group = new GroupCreated(
      event.params.id
    )
  }
  
  group.name = event.params.name
  group.blockNumber = event.block.number
  group.blockTimestamp = event.block.timestamp
  group.transactionHash = event.transaction.hash

  group.save()
}

export function handleMemberInvited(event: MemberInvitedEvent): void {
  let inviteId = getMemberInvitedEventIdFromParams(event.params.groupId, event.params.memberAddress)
  let invite = MemberInvited.load(inviteId)

  if(!invite) {
    invite = new MemberInvited(
      inviteId
    )
  }
  
  invite.groupId = event.params.groupId
  invite.memberAddress = event.params.memberAddress
  invite.nickname = event.params.nickname

  invite.blockNumber = event.block.number
  invite.blockTimestamp = event.block.timestamp
  invite.transactionHash = event.transaction.hash

  invite.save()
}

function getMemberInvitedEventIdFromParams(groupId: Bytes, memberAddress: Address): Bytes {
  return groupId.concat(memberAddress as Bytes)
}

function getEventCreatedIdFromParams(groupId: Bytes, eventDate: BigInt): Bytes {
  return Bytes.fromHexString(groupId.toHexString() + eventDate.toHexString())
}

function getBetCreatedIdFromParams(eventId: Bytes, memberAddress: Address): Bytes {
  return Bytes.fromHexString(eventId.toHexString() + memberAddress.toHexString())
}