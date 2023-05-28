import { log } from '@graphprotocol/graph-ts'
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  GroupCreated as GroupCreatedEvent,
  MemberInvited as MemberInvitedEvent,
  GroupEventCreated as GroupEventCreatedEvent,
} from "../generated/Beer4Crypto/Beer4Crypto"
import {
  Group,
  Member,
  GroupEvent,
} from "../generated/schema"


export function handleGroupCreated(event: GroupCreatedEvent): void {
  let group = Group.load(event.params.id)

  if (!group) {
    group = new Group(
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
  let memberId = getMemberInvitedEventIdFromParams(event.params.groupId, event.params.memberAddress)
  let member = Member.load(memberId)

  if(!member) {
    member = new Member(
      memberId
    )
  }
  
  member.group = event.params.groupId
  member.memberAddress = event.params.memberAddress
  member.nickname = event.params.nickname

  member.blockNumber = event.block.number
  member.blockTimestamp = event.block.timestamp
  member.transactionHash = event.transaction.hash

  member.save()
}

export function handleGroupEventCreated(event: GroupEventCreatedEvent): void {
  let groupEvent = GroupEvent.load(event.params.id)

  if(!groupEvent) {
    groupEvent = new GroupEvent(
      event.params.id
    ) 
  }
  
  groupEvent.creator = getMemberInvitedEventIdFromParams(event.params.groupId, event.params.creator) 
  groupEvent.eventDate = event.params.eventDate
  groupEvent.minDeposit = event.params.minDeposit
  groupEvent.ended = event.params.ended
  groupEvent.group = event.params.groupId
  groupEvent.maxBetDate = event.params.maxBetDate

  groupEvent.blockNumber = event.block.number
  groupEvent.blockTimestamp = event.block.timestamp
  groupEvent.transactionHash = event.transaction.hash

  groupEvent.save()
}


// import { log } from '@graphprotocol/graph-ts'
// import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
// import {
//   BetCreated as BetCreatedEvent,
//   GroupEventCreated as GroupEventCreatedEvent,
//   GroupCreated as GroupCreatedEvent,
//   MemberInvited as MemberInvitedEvent
// } from "../generated/Beer4Crypto/Beer4Crypto"
// import {
//   BetCreated,
//   GroupEventCreated,
//   GroupCreated,
//   MemberInvited
// } from "../generated/schema"

// export function handleBetCreated(event: BetCreatedEvent): void {
//   log.info('Index new Bet for event: {}', [event.params.eventId.toHexString()])
//   let betCreatedId = getBetCreatedIdFromParams(event.params.eventId, event.params.creator)
//   let betCreated = BetCreated.load(betCreatedId)

//   if(!betCreated) {
//     betCreated = new BetCreated(
//       betCreatedId
//     ) 
//   }

//   betCreated.creator = event.params.creator
//   betCreated.groupId = event.params.groupId
//   betCreated.amountDeposited = event.params.amountDeposited
//   betCreated.predictedEthPrice = event.params.predictedEthPrice
//   betCreated.eventId = event.params.eventId

//   betCreated.blockNumber = event.block.number
//   betCreated.blockTimestamp = event.block.timestamp
//   betCreated.transactionHash = event.transaction.hash

//   betCreated.save()
// }

// export function handleGroupEventCreated(event: GroupEventCreatedEvent): void {
//   let groupEventCreated = GroupEventCreated.load(event.params.id)

//   if(!groupEventCreated) {
//     groupEventCreated = new GroupEventCreated(
//       event.params.id
//     ) 
//   }
  
//   groupEventCreated.creator = event.params.creator
//   groupEventCreated.eventDate = event.params.eventDate
//   groupEventCreated.minDeposit = event.params.minDeposit
//   groupEventCreated.ended = event.params.ended
//   groupEventCreated.groupId = event.params.groupId
//   groupEventCreated.maxBetDate = event.params.maxBetDate

//   groupEventCreated.blockNumber = event.block.number
//   groupEventCreated.blockTimestamp = event.block.timestamp
//   groupEventCreated.transactionHash = event.transaction.hash

//   groupEventCreated.save()
// }

// export function handleGroupCreated(event: GroupCreatedEvent): void {
//   let group = GroupCreated.load(event.params.id)

//   if (!group) {
//     group = new GroupCreated(
//       event.params.id
//     )
//   }
  
//   group.name = event.params.name
//   group.blockNumber = event.block.number
//   group.blockTimestamp = event.block.timestamp
//   group.transactionHash = event.transaction.hash

//   group.save()
// }

// export function handleMemberInvited(event: MemberInvitedEvent): void {
//   let inviteId = getMemberInvitedEventIdFromParams(event.params.groupId, event.params.memberAddress)
//   let invite = MemberInvited.load(inviteId)

//   if(!invite) {
//     invite = new MemberInvited(
//       inviteId
//     )
//   }
  
//   invite.groupId = event.params.groupId
//   invite.memberAddress = event.params.memberAddress
//   invite.nickname = event.params.nickname

//   invite.blockNumber = event.block.number
//   invite.blockTimestamp = event.block.timestamp
//   invite.transactionHash = event.transaction.hash

//   invite.save()
// }

function getMemberInvitedEventIdFromParams(groupId: Bytes, memberAddress: Address): Bytes {
  return groupId.concat(memberAddress as Bytes)
}

// function getBetCreatedIdFromParams(eventId: Bytes, memberAddress: Address): Bytes {
//   return Bytes.fromHexString(eventId.toHexString() + memberAddress.toHexString())
// }