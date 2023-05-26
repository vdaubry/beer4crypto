import { gql } from "@apollo/client"

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

const GET_GROUP_MEMBERS = gql`
  query GetMemberInviteds($groupId: Bytes!) {
    memberInviteds(where: { groupId: $groupId }) {
      id
      groupId
      memberAddress
      nickname
    }
  }
`

const GET_GROUPS = gql`
  query GetGroups($ids: [Bytes!]!) {
    groupCreateds(where: { id_in: $ids }) {
      id
      name
    }
  }
`

export { GET_MEMBER_INVITEDS, GET_GROUPS, GET_GROUP_MEMBERS }
