"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig,  configureChains, createConfig } from 'wagmi'
import { foundry, sepolia, baseSepolia } from 'viem/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
// import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { useWeb3ModalTheme } from '@web3modal/wagmi/react';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// 1. Get keys
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? process.env.NEXT_PUBLIC_ALCHEMY_API_KEY: "none"
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID ? process.env.NEXT_PUBLIC_WALLETCONNECT_ID: "none"

// 2. Create wagmiConfig
const metadata = {
  name: 'loyalty-program',
  description: 'Customer Loyalty Program',
  url: 'https://loyalty-program-psi.vercel.app/', 
  icons: ['https://github.com/7Cedars/loyalty-program-next/blob/main/public/iconLoyaltyProgram.svg']
}

const w3mConnector = new WalletConnectConnector({
  options: {
    projectId: projectId,
    metadata: {
      name: 'loyalty-program',
      description: 'Customer Loyalty Program',
      url: 'https://loyalty-program-psi.vercel.app/', 
      icons: ['https://github.com/7Cedars/loyalty-program-next/blob/main/public/iconLoyaltyProgram.svg']
    }
  },
})

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ foundry, sepolia ], //  arbitrum, arbitrumGoerli, optimism, optimismSepolia, baseSepolia
  [ 
    // jsonRpcProvider({
    //   rpc: (localhost) => ({
    //     http: "http://localhost:8545",
    //     chainId: 31337
      // }),
    // }),
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    publicProvider(), 
  ],
)

export const wagmiConfig = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata, 

 })

const config = createConfig({
  autoConnect: true,  
  connectors: [w3mConnector], 
  publicClient,
  webSocketPublicClient,
})

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
})

export function Web3Modal({ children }: any) {
  const { setThemeMode } = useWeb3ModalTheme()
  setThemeMode('light')

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}