"use client";

import Link from 'next/link';
import { useScreenDimensions } from '../../hooks/useScreenDimensions';
import { useAccount, useWalletClient,  } from 'wagmi';
import { useEffect, useState } from 'react';
import { useWeb3ModalState } from '@web3modal/wagmi/react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { usePathname } from 'next/navigation';

const NavbarTop = ( ) => {
  const dimensions = useScreenDimensions();
  const layoutLinks: string = 'p-1 px-6 text-slate-400 aria-selected:text-slate-800'
  const { address, isConnecting, isDisconnected } = useAccount()
  const { selectedNetworkId } = useWeb3ModalState() 
  const [text, setText] = useState('')
  const { open } = useWeb3Modal()
  // const { selectedLoyaltyProgram?.programAddress } = useUrlProgramAddress()
  const path = usePathname()
  const { data: walletClient, status } = useWalletClient();

  const handleLogin = () => {
    walletClient ? open({view: "Account"}) : open({view: "Networks"})
  }

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
          <Link 
            href={'/vendor/home'} 
            className={layoutLinks}
            aria-selected={path == `/vendor/home`}>  
              Home 
          </Link>
          <Link 
            href={'/vendor/scanQrcode'}  
            className={layoutLinks}
            aria-selected={path == `/vendor/scanQrcode`}>  
              Scan qr code
          </Link>
          <Link 
            href={'/vendor/selectGifts' }  
            className={layoutLinks}
            aria-selected={path == `/vendor/selectGifts`}> 
              Select gifts 
          </Link>
          <Link 
            href={'/vendor/stats' }  
            className={layoutLinks}
            aria-selected={path == `/vendor/stats`}>  
              Stats 
          </Link>
        </div> 
        <button className="flex items-center divide-x p-3 divide-gray-400" onClick = {() => handleLogin()}> 
           {text} 
        </button>

      </header>
      );
    }


export default NavbarTop;