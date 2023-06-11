"use client"

import React, { useEffect, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { ethers } from "ethers"
import { contractAddresses, contractAbi } from "@/constants/index"
import {
  useNetwork,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { useContractEvent } from "wagmi"
import { handleFailureNotification, handleSuccessNotification } from "@/utils/notifications"
import { GET_GROUP_EVENT, GET_EVENT_BET } from "@/constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { truncatedAmount } from "@/utils/format"

const CreateBet = (params) => {
  const { address: account } = useAccount()
  const { chain } = useNetwork()
  let contractAddress
  const [predictedEthPrice, setPredictedEthPrice] = useState(0)

  const {
    gqlLoading,
    gqlError,
    data: gqldata,
  } = useQuery(GET_GROUP_EVENT, {
    variables: { eventId: params.eventId },
  })

  const groupEvent = gqldata ? gqldata["groupEvents"][0] : null
  const minDeposit = groupEvent?.minDeposit

  if (chain && contractAddresses[chain.id]) {
    const chainId = chain.id
    contractAddress = contractAddresses[chainId]["contract"]
  }

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "createBet",
    args: [params.eventId, predictedEthPrice.toString(), { value: minDeposit }],
  })

  const { data, write: createBet } = useContractWrite({
    ...config,
    onError(error) {
      handleFailureNotification(error.message)
    },
  })

  useContractEvent({
    address: contractAddress,
    abi: contractAbi,
    eventName: "BetCreated",
    listener(log) {},
  })

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
    onError(error) {
      handleFailureNotification(error.message)
    },
    onSuccess(data) {
      handleSuccessNotification()
    },
  })

  useEffect(() => {}, [])

  if (gqlLoading) return null
  if (gqlError) return `Error! ${gqlError}`

  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-red-100 via-white to-red-100">
      <div className="max-w-2xl w-full my-4 ">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <h2 htmlFor="groupName" className="block text-gray-700 text-2xl font-bold mb-2">
              Create Bet
            </h2>
            <h5>Min bet amount for this event: {truncatedAmount(minDeposit)} ETH</h5>
            <input
              id="predictedEthPrice"
              type="text"
              placeholder="Eth Price Prediction (in $)"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(event) => {
                setPredictedEthPrice(event.target.value)
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={!createBet || isLoading}
              onClick={() => {
                createBet?.()
              }}
            >
              Place Bet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateBet
