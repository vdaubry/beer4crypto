"use client"

import { ConnectKitProvider } from "connectkit"
import { WagmiConfig } from "wagmi"
import { client as wagmiClient } from "@/utils/wagmi"
import AppHeader from "@/components/AppHeader"
import { Inter } from "next/font/google"
import { ToastContainer } from "react-toastify"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import "react-toastify/dist/ReactToastify.css"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

const appoloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
  onError: ({ networkError, graphQLErrors }) => {
    console.log("graphQLErrors", graphQLErrors)
    console.log("networkError", networkError)
  },
})

export default function AppLayout({ children }) {
  return (
    <html>
      <head />
      <body className={inter.className}>
        <WagmiConfig client={wagmiClient}>
          <ConnectKitProvider>
            <ApolloProvider client={appoloClient}>
              <AppHeader />
              {children}
              <ToastContainer />
            </ApolloProvider>
          </ConnectKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
