import { emailConnector } from '@web3modal/wagmi'
import { createConfig, http, webSocket } from '@wagmi/core'
import { foundry, sepolia, polygonMumbai, baseSepolia, optimismSepolia } from '@wagmi/core/chains'
import { walletConnect, injected } from '@wagmi/connectors'

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'loyalty-program',
  description: 'Customer Loyalty Program',
  url: 'https://loyalty-program-psi.vercel.app/', 
  icons: ['public/images/iconLoyaltyProgram.svg']
}

export const wagmiConfig = createConfig({
  chains: [optimismSepolia], //  foundry,  arbitrumSepolia, sepolia,  baseSepolia,  optimismSepolia, polygonMumbai
  transports: {
    // [foundry.id]: http(), 
    // [sepolia.id]: http(`process.env.NEXT_PUBLIC_ALCHEMY_SEP_API_RPC`), 
    // [arbitrumSepolia.id]: http(`https://arb-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ARB_SEP_API_KEY}`), 
    // [arbitrumSepolia.id]: http(), 
    // [baseSepolia.id]: http(), 
    [optimismSepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_OPT_SEPOLIA_API_RPC)  // 
    // [polygonMumbai.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_MUMBAI_API_RPC)
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    // injected({ shimDisconnect: true }), // not needed when using walletConnect connector. 
    // emailConnector({ chains, options: { projectId } }) // this is ff-ing cool! Enable email login with one line of code. NB: this is NOT Account abstraction.  
  ],
  ssr: true,
  // storage: createStorage({
  //   storage: cookieStorage
  // })
})