"use client";

import { notification } from '@/redux/reducers/notificationReducer';
import Link from 'next/link';
import { useScreenDimensions } from '../hooks/useScreenDimensions';
import { useAccount,  } from 'wagmi';
import { useEffect, useState } from 'react';
import { useWeb3ModalState } from '@web3modal/wagmi/react';


const NavbarTop = ( ) => {
  const dimensions = useScreenDimensions();
  const layoutLinks: string = 'p-1 px-6 text-gray-600 hover:text-gray-900'
  const { address, isConnecting, isDisconnected } = useAccount()
  const { selectedNetworkId } = useWeb3ModalState() 
  const [text, setText] = useState('')

  useEffect(() => {
    if (address && selectedNetworkId != undefined) {
      setText(`Logged in: ${address.slice(0,6)}...${address.slice(38,42)}`)
    } else {
      setText('Login')
    }
  }, [selectedNetworkId, address])

    return (
      dimensions.width < 896 ? 
      null 
      :
      <header className="absolute top-0 z-10 flex justify-between h-18 w-full text-sm border-b border-gray-400 bg-slate-50 px-6">
        <div className="flex divide-x p-3 divide-gray-400">
          <Link href='/vendor/landing' className={layoutLinks}> Home </Link>
          <Link href='/vendor/scanQrcode'  className={layoutLinks}> Gift & Redeem </Link>
          <Link href='/vendor/selectTokens'  className={layoutLinks}> Select tokens </Link>
          <Link href='/vendor/stats'  className={layoutLinks}> Stats </Link>
        </div> 
        <div className="flex divide-x p-3 divide-gray-400"> 
          <Link href='/vendor/login' className={layoutLinks}> {text} </Link>
        </div>

      </header>
      );
    }


export default NavbarTop;