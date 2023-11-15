import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// import dynamic from 'next/dynamic'
// const ComponentC = dynamic(() => import('../components/C'), { ssr: false })
// const {Web3Modal} = dynamic(() => import('../context/Web3Modal'), { ssr: false })

import { Web3Modal } from "../context/Web3Modal";
import { ReduxProvider } from "../context/reduxProvider" 

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Customer Loyalty Program',
  description: 'Customer Loyalty Program build in Next and ethers, with backend in solidity.',
}

// I think this is where to also position redux provider! 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Web3Modal>
            {children}
          </Web3Modal>
        </ReduxProvider>
      </body>
    </html>
  )
}
