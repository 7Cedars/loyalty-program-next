import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { optimismSepolia, foundry, sepolia, baseSepolia, arbitrumSepolia } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'loyalty-program',
  description: 'Customer Loyalty Program',
  url: 'https://loyalty-program-psi.vercel.app/', 
  icons: ['public/images/iconLoyaltyProgram.svg']
}

// Create wagmiConfig
const chains = [arbitrumSepolia] as const // Here place all chains 
export const config = createConfig({
  chains: chains,
  transports: {
    [arbitrumSepolia.id]: http(), // £todo: link to avalance RPC. 
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})