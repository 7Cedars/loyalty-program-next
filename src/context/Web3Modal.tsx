"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig,  configureChains, createConfig } from 'wagmi'
import { optimismSepolia, foundry, sepolia, baseSepolia, arbitrumSepolia } from 'viem/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { useWeb3ModalTheme } from '@web3modal/wagmi/react';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

// 1. Get keys
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? process.env.NEXT_PUBLIC_ALCHEMY_API_KEY: "none"
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID ? process.env.NEXT_PUBLIC_WALLETCONNECT_ID: "none"

// 2. Create wagmiConfig
const metadata = {
  name: 'loyalty-program',
  description: 'Customer Loyalty Program',
  url: 'https://loyalty-program-psi.vercel.app/', 
  icons: ['public/images/iconLoyaltyProgram.svg']
}

const w3mConnector = new WalletConnectConnector({
  options: {
    projectId: projectId,
    metadata: {
      name: 'loyalty-program',
      description: 'Customer Loyalty Program',
      url: 'https://loyalty-program-psi.vercel.app/', 
      icons: ['public/images/iconLoyaltyProgram.svg']
    }
  },
})

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ arbitrumSepolia ], //  local: foundry // L1 test: sepolia, //L2 test: baseSepolia, arbitrumSepolia, arbitrumGoerli, polygonMumbai // L2s: arbitrum, optimism, base, polygon 
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
  autoConnect: false,  
  connectors: [w3mConnector], 
  publicClient,
  webSocketPublicClient,
})

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
})

// NB! Continue here!!! 
export function Web3Modal({ children }: any) {

  const { setThemeMode } = useWeb3ModalTheme()
  setThemeMode('light')

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}