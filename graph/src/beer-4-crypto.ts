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
  let entity = new GroupCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.name
  entity.Beer4Crypto_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMemberInvited(event: MemberInvitedEvent): void {
  let entity = new MemberInvited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupId = event.params.groupId
  entity.memberAddress = event.params.memberAddress
  entity.nickname = event.params.nickname

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
