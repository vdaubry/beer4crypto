"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ethers } from "ethers";
import { contractAddresses, contractAbi } from "@/constants/index";
import {
  useNetwork,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useContractEvent } from "wagmi";
import {
  handleFailureNotification,
  handleSuccessNotification,
} from "@/utils/notifications";

const CreateEvent = (groupId) => {
  const computeMaxBetDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    setMaxBetDate(date);
  };

  const { chain } = useNetwork();
  const { address: account } = useAccount();
  const [eventDate, setEventDate] = useState(new Date());
  const [minDeposit, setMinDeposit] = useState(
    ethers.utils.parseEther("0.0025")
  ); //0.0025 ETH
  const [maxBetDate, setMaxBetDate] = useState(0);

  let contractAddress;

  if (chain && contractAddresses[chain.id]) {
    const chainId = chain.id;
    contractAddress = contractAddresses[chainId]["contract"];
  }

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "createEvent",
    args: [eventDate, minDeposit, groupId, maxBetDate],
  });

  const { data, write: createEvent } = useContractWrite({
    ...config,
    onError(error) {
      handleFailureNotification(error.message);
    },
  });

  useContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "EventCreated",
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

  useEffect(() => {
    computeMaxBetDate(1);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-red-100 via-white to-red-100">
      <div className="max-w-2xl w-full my-4 ">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <h2 className="block text-gray-700 text-2xl font-bold mb-2">
              Schedule a new event
            </h2>
            <DatePicker
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
            />
            <Listbox value={7} onChange={console.log("foo")}>
              <Listbox.Button>Foo</Listbox.Button>
              <Listbox.Options>
                <Listbox.Option value={1}>1 day</Listbox.Option>
                <Listbox.Option value={7}>1 week</Listbox.Option>
                <Listbox.Option value={30}>1 month</Listbox.Option>
              </Listbox.Options>
            </Listbox>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={!createEvent || !eventDate}
              onClick={() => {
                createEvent?.();
              }}
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
