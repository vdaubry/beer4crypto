import React from "react";
import MemberList from "@/components/MemberList";
import InviteMember from "@/components/InviteMember";
import ClientOnly from "@/utils/clientOnly";
import CreateEvent from "@/components/CreateEvent";

const Page = ({ params }) => {
  return (
    <ClientOnly>
      <CreateEvent groupId={params.id} />;
      <MemberList groupId={params.id} />;
      <InviteMember groupId={params.id} />;
    </ClientOnly>
  );
};

export default Page;
