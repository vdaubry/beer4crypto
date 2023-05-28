import React from "react"
import ListGroupMembers from "@/components/ListGroupMembers"
import InviteMember from "@/components/InviteMember"
import ClientOnly from "@/utils/clientOnly"
import CreateEvent from "@/components/CreateEvent"
import ListGroupEvents from "@/components/ListGroupEvents"

const Page = ({ params }) => {
  return (
    <ClientOnly>
      <CreateEvent groupId={params.id} />;
      <ListGroupEvents groupId={params.id} />;
      <ListGroupMembers groupId={params.id} />;
      <InviteMember groupId={params.id} />;
    </ClientOnly>
  )
}

export default Page
