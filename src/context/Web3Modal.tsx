"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig,  configureChains, createConfig } from 'wagmi'
import { localhost, sepolia, baseSepolia } from 'viem/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

// const selectedChains = [baseSepolia] // other options: , arbitrum, arbitrumGoerli, optimism, optimismSepolia,
const SEPOLIA_RPC_HTPPS = process.env.NEXT_PUBLIC_SEPOLIA_RPC_HTPPS ? process.env.NEXT_PUBLIC_SEPOLIA_RPC_HTPPS : "none"
const SEPOLIA_RPC_WEBSOCKET = process.env.NEXT_PUBLIC_SEPOLIA_RPC_WEBSOCKET ? process.env.NEXT_PUBLIC_SEPOLIA_RPC_WEBSOCKET : "none"
const NEXT_PUBLIC_WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID ? process.env.NEXT_PUBLIC_WALLETCONNECT_ID : "none"

// 1. Get projectId
const projectId = NEXT_PUBLIC_WALLETCONNECT_ID

// 2. Create wagmiConfig
const metadata = {
  name: 'Customer Loyalty Program',
  description: 'Customer Loyalty Program',
  url: 'https://web3modal.com', // TODO 
  icons: ['https://avatars.githubusercontent.com/u/37784886'] // TODO 
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ localhost, sepolia ], // localhost,
  [ 
    jsonRpcProvider({
      rpc: (localhost) => ({
        http: "http://127.0.0.1:8545",
      }),
    }),
  ],
)

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

const config = createConfig({
  autoConnect: true, // this should be different, right? 
  publicClient,
  webSocketPublicClient,
})

createWeb3Modal({ wagmiConfig, projectId, chains })

export function Web3Modal({ children }: any) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}