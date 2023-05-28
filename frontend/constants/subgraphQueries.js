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
        ended
        creator {
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

const GET_MEMBER_INVITEDS = gql`
  query GetMemberInviteds($memberAddress: String!) {
    memberInviteds(where: { memberAddress: $memberAddress }) {
      id
      groupId
      memberAddress
      nickname
    }
  }
`

export { GET_GROUPS_BY_MEMBER, GET_GROUP_EVENTS, GET_MEMBER_INVITEDS, GET_GROUP_MEMBERS }
