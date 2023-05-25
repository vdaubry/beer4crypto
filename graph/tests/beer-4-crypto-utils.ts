import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  BetCreated,
  EventCreated,
  GroupCreated,
  MemberInvited
} from "../generated/Beer4Crypto/Beer4Crypto"

export function createBetCreatedEvent(
  creator: Address,
  pickWinnerDate: BigInt,
  minDeposit: BigInt,
  groupId: Bytes,
  maxBetDateInterval: BigInt
): BetCreated {
  let betCreatedEvent = changetype<BetCreated>(newMockEvent())

  betCreatedEvent.parameters = new Array()

  betCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  betCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "pickWinnerDate",
      ethereum.Value.fromUnsignedBigInt(pickWinnerDate)
    )
  )
  betCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "minDeposit",
      ethereum.Value.fromUnsignedBigInt(minDeposit)
    )
  )
  betCreatedEvent.parameters.push(
    new ethereum.EventParam("groupId", ethereum.Value.fromFixedBytes(groupId))
  )
  betCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxBetDateInterval",
      ethereum.Value.fromUnsignedBigInt(maxBetDateInterval)
    )
  )

  return betCreatedEvent
}

export function createEventCreatedEvent(
  creator: Address,
  eventDate: BigInt,
  minDeposit: BigInt,
  groupId: Bytes,
  maxBetDate: BigInt
): EventCreated {
  let eventCreatedEvent = changetype<EventCreated>(newMockEvent())

  eventCreatedEvent.parameters = new Array()

  eventCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "eventDate",
      ethereum.Value.fromUnsignedBigInt(eventDate)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "minDeposit",
      ethereum.Value.fromUnsignedBigInt(minDeposit)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam("groupId", ethereum.Value.fromFixedBytes(groupId))
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxBetDate",
      ethereum.Value.fromUnsignedBigInt(maxBetDate)
    )
  )

  return eventCreatedEvent
}

export function createGroupCreatedEvent(name: string, id: Bytes): GroupCreated {
  let groupCreatedEvent = changetype<GroupCreated>(newMockEvent())

  groupCreatedEvent.parameters = new Array()

  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return groupCreatedEvent
}

export function createMemberInvitedEvent(
  groupId: Bytes,
  memberAddress: Address,
  nickname: string
): MemberInvited {
  let memberInvitedEvent = changetype<MemberInvited>(newMockEvent())

  memberInvitedEvent.parameters = new Array()

  memberInvitedEvent.parameters.push(
    new ethereum.EventParam("groupId", ethereum.Value.fromFixedBytes(groupId))
  )
  memberInvitedEvent.parameters.push(
    new ethereum.EventParam(
      "memberAddress",
      ethereum.Value.fromAddress(memberAddress)
    )
  )
  memberInvitedEvent.parameters.push(
    new ethereum.EventParam("nickname", ethereum.Value.fromString(nickname))
  )

  return memberInvitedEvent
}
