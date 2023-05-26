import React from "react"
import Link from "next/link"
import { useState } from "react"
import { contractAddresses, contractAbi } from "@/constants/index"
import { useNetwork, useAccount, useContractRead } from "wagmi"
import { GET_MEMBER_INVITEDS, GET_GROUPS } from "@/constants/subgraphQueries"
import { useQuery } from "@apollo/client"

const ListGroups = () => {
  const { chain } = useNetwork()
  const { address: account } = useAccount()

  const {
    loading,
    error,
    data: memberInviteds,
  } = useQuery(GET_MEMBER_INVITEDS, {
    variables: { memberAddress: account },
  })

  const groupIds = memberInviteds?.memberInviteds?.map((memberInvited) => memberInvited.groupId)
  const {
    loading: loading2,
    error: error2,
    data: groups,
  } = useQuery(GET_GROUPS, {
    variables: {
      ids: groupIds,
      skip: !groupIds, // skip this query if groupIds is not defined
    },
  })

  if (loading || loading2) return null
  if (error || error2) return `Error! ${error} , ${error2}`

  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-red-100 via-white to-red-100">
      <div className="max-w-md w-full my-4 ">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <h2 className="block text-gray-700 text-2xl font-bold mb-2">Your groups</h2>
            <div className="relative bg-slate-50 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
              <div className="relative rounded-xl overflow-auto">
                <div className="shadow-sm overflow-hidden my-8">
                  <table className="border-collapse table-auto w-full text-sm">
                    <thead>
                      <tr>
                        <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left">
                          Name
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {groups.groupCreateds?.map((group, i) => (
                        <tr key={i}>
                          <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                            <Link href={`/groups/${group.id}`}>{group.name}</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListGroups
