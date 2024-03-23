import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { config } from '../../config'
import Web3ModalProvider from '../context/Web3ModalProvider'
import { ReduxProvider } from "../context/reduxProvider" 

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Customer Loyalty Program',
  description: 'Customer Loyalty Program build in Next and ethers, with backend in solidity.',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider initialState={initialState}>
          <ReduxProvider>
          {children}
          </ReduxProvider>
        </Web3ModalProvider>
      </body>
    </html>
  )
}