import React from "react";
import ClientOnly from "@/utils/clientOnly";
import CreateBet from "@/components/CreateEvent";

const Page = ({ params }) => {
  return (
    <ClientOnly>
      <CreateBet eventId={params.id} />;
    </ClientOnly>
  );
};

export default Page;
