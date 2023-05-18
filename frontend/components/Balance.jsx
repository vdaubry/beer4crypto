import React from "react";

import {
  useNetwork,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { truncatedAmount } from "@/utils/format";

const Balance = () => {
  const { chain } = useNetwork();
  const { address: account } = useAccount();

  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    address: account,
  });

  if (isError) return <div>Error fetching balance</div>;
  return (
    <div className="py-8 px-4 flex items-center justify-center">
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-4">
        <div className="text-2xl font-semibold text-white">
          {isLoading && (
            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
          )}
          <p>
            Your balance is: {truncatedAmount(balance?.value)} {balance?.symbol}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Balance;
