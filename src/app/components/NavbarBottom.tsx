"use client";

import Link from 'next/link';
import { 
  ArrowRightStartOnRectangleIcon, 
  SquaresPlusIcon,
  QrCodeIcon,
  HomeIcon, 
  ChartBarSquareIcon,
  GiftIcon,
  CreditCardIcon
 } from '@heroicons/react/24/outline'
import { useScreenDimensions } from '../hooks/useScreenDimensions';
import { useAccount, useWalletClient } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { usePathname } from 'next/navigation';

type AppMode = {selection: "customer" | "vendor"}

const NavbarBottom = ({selection}: AppMode) => {
  const dimensions = useScreenDimensions();  
  const layoutLinks: string = 'py-1 px-6 text-slate-400 aria-selected:text-slate-800 aria-selected:text-slate-800 dark:text-slate-600 dark:aria-selected:text-slate-200 dark:aria-selected:text-slate-200 grid grid-cols-1'
  const layoutIconBox: string = 'col-span-1 grid text-xs justify-items-center'
  const layoutIcons: string = 'h-7 w-7'
  const { open } = useWeb3Modal()
  const { status } = useAccount() 
  const path = usePathname()
  // const { selectedLoyaltyProgram?.programAddress } = useUrlProgramAddress()
  
  return (
    dimensions.width >= 896 ? 
    null
    :
    <header className="absolute bottom-0 z-10 flex justify-between h-12 w-full bg-slate-100/75 dark:bg-slate-900/75 text-sm border-t border-gray-400 px-4">
      
        <Link 
          href={selection == 'vendor' ? '/vendor/home' : "/customer/home"}
          aria-selected={selection == 'vendor' ? path == `/vendor/home` : path == "/customer/home" }
          className={layoutLinks}
          > 
          <div className='col-span-1 grid text-xs justify-items-center'> 
            { selection == 'vendor' ?
              <HomeIcon
                className={layoutIcons}
              />
              :
              <QrCodeIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            }
            Home
          </div> 
        </Link>
        <Link 
          href={selection == 'vendor' ? '/vendor/scanQrcode' : "/customer/claim"} 
          aria-selected={selection == 'vendor' ? path == `/vendor/scanQrcode` : path == "/customer/claim" } 
          className={layoutLinks}
          >
          <div className={layoutIconBox}> 
            { selection == 'vendor' ?
              <>
              <QrCodeIcon
                className={layoutIcons}
              />
              Scan
              </>
              :
              <>
              <GiftIcon
              className={layoutIcons}
              aria-hidden="true"
              />
              Claim
              </>            
            }
          </div>  
        </Link>
        <Link 
          href={selection == 'vendor' ? '/vendor/selectGifts' : '/customer/card'} 
          aria-selected={selection == 'vendor' ? path == `/vendor/selectGifts` : path == "/customer/card" }  
          className={layoutLinks}
        > 
          <div className={layoutIconBox}> 
          { selection == 'vendor' ?
              <>
              <SquaresPlusIcon
                className={layoutIcons}
                
              />
              Gifts
              </>
            :
              <>
               <CreditCardIcon
                className={layoutIcons}
                aria-hidden="true"
              />
              Card
              </>
            }
          </div> 
        </Link>
        <Link 
          href={selection == 'vendor' ? '/vendor/stats' : "/customer/transactions"} 
          aria-selected={selection == 'vendor' ? path == `/vendor/stats` : path == "/customer/transactions" }  
          className={layoutLinks}
          > 
          <div className={layoutIconBox}> 
            <ChartBarSquareIcon
              className={layoutIcons}
              
            />
            {selection == 'vendor' ? "Stats" : "Transactions" }
          </div> 
        </Link>
        <button onClick = {() => status === "connected" ? open({view: "Account"}) : open({view: 'Connect'})} className={layoutLinks} > 
          <div className={layoutIconBox}> 
            <ArrowRightStartOnRectangleIcon
              className={layoutIcons}
            />
            Login 
          </div> 
        </button>
    </header>
  );
}

export default NavbarBottom;