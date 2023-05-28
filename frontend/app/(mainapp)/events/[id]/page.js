import React from "react"
import ClientOnly from "@/utils/clientOnly"
import CreateBet from "@/components/CreateBet"
import ListBets from "@/components/ListBets"

const Page = ({ params }) => {
  return (
    <ClientOnly>
      {/* <CreateBet eventId={params.id} />; */}
      <ListBets eventId={params.id}></ListBets>
    </ClientOnly>
  )
}

export default Page
