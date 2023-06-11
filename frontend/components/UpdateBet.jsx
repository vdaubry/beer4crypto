"use client"

import React, { useEffect, useState } from "react"
import { formatDate, truncatedAmount } from "@/utils/format"
const UpdateBet = (params) => {
  const existingBet = params.existingBet
  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-red-100 via-white to-red-100">
      <div className="max-w-md w-full my-4 ">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <h2 className="block text-gray-700 text-2xl font-bold mb-2">Your bet</h2>
            <div className="relative bg-slate-50 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
              <div className="relative rounded-xl overflow-auto">
                <div className="shadow-sm overflow-hidden my-8">
                  <p>Predicted ETH Price: {existingBet.predictedEthPrice}</p>
                  <p>Bet date: {formatDate(existingBet.betDate * 1000)}</p>
                  <p>Amount deposited: {truncatedAmount(existingBet.amountDeposited)} ETH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateBet
