"use client";

import Link from 'next/link';
import { useScreenDimensions } from '../hooks/useScreenDimensions';
import { useAccount,  } from 'wagmi';
import { useEffect, useState } from 'react';
import { useWeb3ModalState } from '@web3modal/wagmi/react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

type AppMode = {selection: "customer" | "vendor"}
 
const NavbarTop = ({selection}: AppMode) => {
  const dimensions = useScreenDimensions();
  const layoutLinks: string = 'p-1 px-6 text-slate-400 aria-selected:text-slate-800'
  const { address } = useAccount()
  const { selectedNetworkId } = useWeb3ModalState() 
  const [text, setText] = useState('')
  const {status} = useAccount() 
  const { open, close } = useWeb3Modal()
  const path = usePathname()

  useEffect(() => {
    if (address && selectedNetworkId != undefined) {
      setText(`Logged in: ${address.slice(0,6)}...${address.slice(38,42)}`)
    } else {
      setText('Login')
    }
  }, [selectedNetworkId, address])

    return (
      dimensions.width < 896  ? 
      null 
      :
      <header className="absolute top-0 z-10 flex justify-between h-18 w-full text-sm border-b border-gray-400 bg-slate-50 px-6">
        <div className="flex divide-x p-3 divide-gray-400">
          <Link 
            href={selection == 'vendor' ? '/vendor/home' : '/customer/home'} 
            aria-selected={selection == 'vendor' ? path == `/vendor/home` : path == `/customer/home`}
            className={layoutLinks}
            >
            Home 
          </Link>

          <Link 
            href={selection == 'vendor' ? '/vendor/scanQrcode' : '/customer/claim'} 
            aria-selected={selection == 'vendor' ? path == '/vendor/scanQrcode' : path == `/customer/claim`}
            className={layoutLinks}
            > 
            {selection == 'vendor' ? "Scan qrcode" : "Claim Gifts"}
          </Link>

          <Link
            href={selection == 'vendor' ? '/vendor/selectGifts' : '/customer/card'} 
            aria-selected={selection == 'vendor' ? path == '/vendor/selectGifts' : path == `/customer/card`}
            className={layoutLinks}
            >
            {selection == 'vendor' ? "Select Gifts" : "Your Card"}
          </Link>
          
          <Link
            href={selection == 'vendor' ? '/vendor/stats' : '/customer/transactions'} 
            aria-selected={selection == 'vendor' ? path == '/vendor/stats' : path == `/customer/transactions`}
            className={layoutLinks}
            >
            {selection == 'vendor' ? "Stats" : "Transactions"}
          </Link>
        </div> 

        <button className="flex items-center divide-x p-3 divide-gray-400" onClick = {() => status === "connected" ? open({view: "Account"}) : open({view: 'Connect'}) }> 
           {text} 
        </button>

      </header>
      );
    }


export default NavbarTop;