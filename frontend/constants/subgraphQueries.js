import { gql } from "@apollo/client"

const GET_GROUPS_BY_MEMBER = gql`
  query GetGroupsByMember($address: Bytes!) {
    members(where: { memberAddress: $address }) {
      group {
        id
        name
      }
    }
  }
`

const GET_GROUP_EVENTS = gql`
  query GetGroupEvents($groupId: Bytes!) {
    groups(where: { id: $groupId }) {
      events {
        id
        maxBetDate
        minDeposit
        eventDate
        creator {
          memberAddress
        }
        winner {
          memberAddress
        }
      }
    }
  }
`

const GET_GROUP_MEMBERS = gql`
  query GetGroupMembers($groupId: Bytes!) {
    groups(where: { id: $groupId }) {
      members {
        id
        memberAddress
        nickname
      }
    }
  }
`

const GET_BETS = gql`
  query GetBets($eventId: Bytes!) {
    groupEvents(where: { id: $eventId }) {
      bets {
        id
        predictedEthPrice
        betDate
        amountDeposited
        creator {
          id
          memberAddress
          nickname
        }
      }
    }
  }
`

const GET_EVENT_BET = gql`
  query GetEventBet($eventId: Bytes!, $memberAddress: Bytes!) {
    bets(where: { creator_: { memberAddress: $memberAddress }, groupEvent_: { id: $eventId } }) {
      id
      predictedEthPrice
      betDate
      amountDeposited
      creator {
        id
        memberAddress
        nickname
      }
    }
  }
`

const GET_GROUP_EVENT = gql`
  query GetGroupEvent($eventId: Bytes!) {
    groupEvents(where: { id: $eventId }) {
      id
      maxBetDate
      minDeposit
      eventDate
      ended
      creator {
        memberAddress
      }
    }
  }
`
export {
  GET_GROUPS_BY_MEMBER,
  GET_GROUP_EVENTS,
  GET_GROUP_MEMBERS,
  GET_BETS,
  GET_GROUP_EVENT,
  GET_EVENT_BET,
}
