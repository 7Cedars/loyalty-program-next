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
// 1. Get keys
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? process.env.NEXT_PUBLIC_ALCHEMY_API_KEY: "none"
// if (!ALCHEMY_API_KEY) {
//   throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is not set')
// }

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID 
if (!projectId) {
  throw new Error('EXT_PUBLIC_WALLETCONNECT_ID is not set')
}

// 2. Create wagmiConfig
const metadata = {
  name: 'loyalty-program',
  description: 'Customer Loyalty Program',
  url: 'https://loyalty-program-psi.vercel.app/', 
  icons: ['https://github.com/7Cedars/loyalty-program-next/blob/main/public/iconLoyaltyProgram.svg']
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
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
  ],
)

export const wagmiConfig = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata
 })

// const config = createConfig({
//   autoConnect: false,  
//   publicClient,
//   webSocketPublicClient,
// })

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,

  })

export function Web3Modal({ children }: any) {
  const { setThemeMode } = useWeb3ModalTheme()
  setThemeMode('light')

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}