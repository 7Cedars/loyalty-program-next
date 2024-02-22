"use client";

import Link from 'next/link';
import { 
  ArrowRightOnRectangleIcon, 
  GiftIcon, 
  QrCodeIcon,
  ChartBarSquareIcon, 
  CreditCardIcon
 } from '@heroicons/react/24/outline'
import { useScreenDimensions } from '../../hooks/useScreenDimensions';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
 

const NavbarBottom = ( ) => {
  const dimensions = useScreenDimensions();  
  const layoutLinks: string = 'py-1 px-6 text-slate-400 aria-selected:text-slate-800 aria-selected:text-slate-800 dark:text-slate-600 dark:aria-selected:text-slate-200 dark:aria-selected:text-slate-200 grid grid-cols-1'
  const layoutIconBox: string = 'col-span-1 grid text-xs justify-items-center'
  const layoutIcons: string = 'h-7 w-7'
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { address } = useAccount() 
  const { open } = useWeb3Modal()
  const path = usePathname()

  return (
    dimensions.width >= 896 ? 
    null
    :
    <header className="absolute bottom-0 z-10 flex justify-between h-12 w-full bg-slate-100/75 dark:bg-slate-900/75 text-sm border-t border-gray-400 px-4">
      
        <Link 
          href={`/customer/home?${selectedLoyaltyProgram?.programAddress}`}  
          className={layoutLinks}
          aria-selected={path == `/customer/home`}> 
          <div className='col-span-1 grid text-xs justify-items-center'> 
            <QrCodeIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Home
          </div> 
        </Link>
        <Link 
          href={`/customer/claim?${selectedLoyaltyProgram?.programAddress}` } 
          className={layoutLinks}
          aria-selected={path == `/customer/claim`}> 
          <div className={layoutIconBox}> 
            <GiftIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Claim
          </div> 
        </Link>
        <Link 
          href={`/customer/card?${selectedLoyaltyProgram?.programAddress}` }  
          className={layoutLinks}
          aria-selected={path == `/customer/card`}>  
          <div className={layoutIconBox}> 
            <CreditCardIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Card 
          </div> 
        </Link>
        <Link 
          href={`/customer/transactions?${selectedLoyaltyProgram?.programAddress}`} 
          className={layoutLinks}
          aria-selected={path == `/customer/transactions`}>  
          <div className={layoutIconBox}> 
            <ChartBarSquareIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Transactions
          </div>  
        </Link>
        <button onClick = {() => open(address ? {view: "Account"} : {view: "Networks"} )} className={layoutLinks} > 
          <div className={layoutIconBox}> 
            <ArrowRightOnRectangleIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Login 
          </div> 
        </button>
    </header>
  );
}

export default NavbarBottom;