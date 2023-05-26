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
  let entity = new BetCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.pickWinnerDate = event.params.pickWinnerDate
  entity.minDeposit = event.params.minDeposit
  entity.groupId = event.params.groupId
  entity.maxBetDateInterval = event.params.maxBetDateInterval

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEventCreated(event: EventCreatedEvent): void {
  let entity = new EventCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.eventDate = event.params.eventDate
  entity.minDeposit = event.params.minDeposit
  entity.groupId = event.params.groupId
  entity.maxBetDate = event.params.maxBetDate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
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
