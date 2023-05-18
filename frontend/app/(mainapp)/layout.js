"use client";

import { ConnectKitProvider } from "connectkit";
import { WagmiConfig } from "wagmi";
import { client } from "@/utils/wagmi";
import AppHeader from "@/components/AppHeader";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({ children }) {
  return (
    <html>
      <head />
      <body className={inter.className}>
        <WagmiConfig client={client}>
          <ConnectKitProvider>
            <AppHeader />
            {children}
            <ToastContainer />
          </ConnectKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
