"use client";

import Link from 'next/link';
import { useScreenDimensions } from '../../hooks/useScreenDimensions';
import { useAccount,  } from 'wagmi';
import { useEffect, useState } from 'react';
import { useWeb3ModalState } from '@web3modal/wagmi/react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
 
const NavbarTop = ( ) => {
  const dimensions = useScreenDimensions();
  const layoutLinks: string = 'p-1 px-6 text-slate-400 aria-selected:text-slate-800'
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { address } = useAccount()
  const { selectedNetworkId } = useWeb3ModalState() 
  const [text, setText] = useState('')
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
            href={`/customer/home?${selectedLoyaltyProgram?.programAddress}`} 
            className={layoutLinks}
            aria-selected={path == `/customer/home`}>   
              Home 
          </Link>
          <Link 
            href={`/customer/claim?${selectedLoyaltyProgram?.programAddress}` }  
            className={layoutLinks}
            aria-selected={path == `/customer/claim`}>   
              Claim Gifts 
          </Link>
          <Link 
            href={`/customer/card?${selectedLoyaltyProgram?.programAddress}` }  
            className={layoutLinks}
            aria-selected={path == `/customer/card`}>   
              Your Card 
          </Link>
          <Link 
            href={`/customer/transactions?${selectedLoyaltyProgram?.programAddress}`}  
            className={layoutLinks}
            aria-selected={path == `/customer/transactions`}>   
              Transactions 
          </Link>
        </div> 
        <button className="flex items-center divide-x p-3 divide-gray-400" onClick = {() => open(address ? {view: "Account"} : {view: "Networks"} )}> 
           {text} 
        </button>
      </header>
      );
    }


export default NavbarTop;