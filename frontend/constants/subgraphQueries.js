import { gql } from "@apollo/client"

const SUBGRAPH_QUERY_URL = "https://api.studio.thegraph.com/query/46699/beer4crypto/v0.0.1"

export const getMemberGroups = (address) => {
  return gql`
    {
      memberInvited(where: { memberAddress: ${address} }) {
        id
        groupId
        memberAddress
        nickname
      }
    }
  `
}
