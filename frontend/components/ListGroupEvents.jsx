"use client"

import React from "react"
import Link from "next/link"
import { formatDate, formatAddress } from "@/utils/format"
import { GET_GROUP_EVENTS } from "@/constants/subgraphQueries"
import { useQuery } from "@apollo/client"

const ListGroupEvents = (params) => {
  const {
    loading,
    error,
    data: data,
  } = useQuery(GET_GROUP_EVENTS, {
    variables: { groupId: params.groupId },
  })

  if (loading) return null
  if (error) return `Error! ${error}`

  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-red-100 via-white to-red-100">
      <div className="max-w-2xl w-full my-4 ">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <h2 className="block text-gray-700 text-2xl font-bold mb-2">Events for your group</h2>
            <div className="relative bg-slate-50 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
              <div className="relative rounded-xl overflow-auto">
                <div className="shadow-sm overflow-hidden my-8">
                  <table className="border-collapse table-auto w-full text-sm">
                    <thead>
                      <tr>
                        <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left">
                          eventDate
                        </th>
                        <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left">
                          creator
                        </th>
                        <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left">
                          winner
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {data.groups
                        .map((group) => group.events)
                        .flat()
                        .map((event, i) => (
                          <tr key={i}>
                            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                              <Link href={`/events/${event.id}`}>
                                {formatDate(event.eventDate)}
                              </Link>
                            </td>
                            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                              {formatAddress(event.creator.memberAddress)}
                            </td>
                            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                              {formatAddress(event.creator.winner)}
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

export default ListGroupEvents
