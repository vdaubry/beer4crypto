"use client"

import React from "react"
import ClientOnly from "@/utils/clientOnly"
import CreateBet from "@/components/CreateBet"
import ListBets from "@/components/ListBets"
import UpdateBet from "@/components/UpdateBet"
import { GET_EVENT_BET } from "@/constants/subgraphQueries"
import { useAccount } from "wagmi"
import { useQuery } from "@apollo/client"

const Page = ({ params }) => {
  const { address: account } = useAccount()

  const {
    gqlLoading: gqlLoading,
    gqlError: gqlError,
    data: gqldata,
  } = useQuery(GET_EVENT_BET, {
    variables: { eventId: params.id, memberAddress: account },
  })
  const existingBet = gqldata ? gqldata["bets"][0] : null

  if (gqlLoading) return null
  if (gqlError) return `Error! ${gqlError}`

  return (
    <ClientOnly>
      <ListBets eventId={params.id}></ListBets>
      {existingBet ? <UpdateBet existingBet={existingBet} /> : <CreateBet eventId={params.id} />}
    </ClientOnly>
  )
}

export default Page
