"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig,  configureChains, createConfig } from 'wagmi'
import { foundry, sepolia, baseSepolia } from 'viem/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { useWeb3ModalTheme } from '@web3modal/wagmi/react';
import { createWalletClient, http } from 'viem';

// const selectedChains = [baseSepolia] // other options: , arbitrum, arbitrumGoerli, optimism, optimismSepolia,
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ? process.env.NEXT_PUBLIC_API_KEY : "none"
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
  [ foundry, sepolia ],
  [ 
    publicProvider(), 
    jsonRpcProvider({
      rpc: (localhost) => ({
        http: "http://localhost:8545",
        chainId: 31337
      }),
    }),
    alchemyProvider({ apiKey: API_KEY }),
  ],
)

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// const config = createConfig({
//   autoConnect: false,  
//   publicClient,
//   webSocketPublicClient,
// })

createWeb3Modal({ wagmiConfig, projectId, chains })

export function Web3Modal({ children }: any) {
  const { setThemeMode } = useWeb3ModalTheme()
  setThemeMode('light')

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}