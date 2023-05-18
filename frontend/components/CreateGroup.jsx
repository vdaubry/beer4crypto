import React from "react";
import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { contractAddresses, contractAbi } from "@/constants/index";
import {
  useNetwork,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractEvent,
} from "wagmi";
import {
  handleFailureNotification,
  handleSuccessNotification,
} from "@/utils/notifications";

const CreateGroup = () => {
  const { chain } = useNetwork();
  const { address: account } = useAccount();
  const [groupName, setGroupName] = useState("");
  const [nickname, setNickname] = useState("");

  let contractAddress;

  if (chain && contractAddresses[chain.id]) {
    const chainId = chain.id;
    contractAddress = contractAddresses[chainId]["contract"];
  }

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "createGroup",
    args: [groupName, nickname],
  });

  const { data, write: createGroup } = useContractWrite({
    ...config,
    onError(error) {
      handleFailureNotification(error.message);
    },
  });

  useContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "GroupCreated",
    listener(log) {},
  });

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
    onError(error) {
      handleFailureNotification(error.message);
    },
    onSuccess(data) {
      handleSuccessNotification();
    },
  });

  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-red-100 via-white to-red-100">
      <div className="max-w-md w-full my-4 ">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <h2 className="block text-gray-700 text-2xl font-bold mb-2">
              Add a new group
            </h2>
            <input
              id="groupName"
              type="text"
              placeholder="your group name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(event) => {
                setGroupName(event.target.value);
              }}
            />
            <input
              id="nickname"
              type="text"
              placeholder="your nickname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3"
              onChange={(event) => {
                setNickname(event.target.value);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={!createGroup || !groupName}
              onClick={() => {
                createGroup?.();
              }}
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
