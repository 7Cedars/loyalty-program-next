"use client";

import Link from 'next/link';
import { 
  ArrowRightOnRectangleIcon, 
  SquaresPlusIcon,
  QrCodeIcon,
  HomeIcon, 
  ChartBarSquareIcon
 } from '@heroicons/react/24/outline'
import { useScreenDimensions } from '../../hooks/useScreenDimensions';
import { useAccount, useWalletClient } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { usePathname } from 'next/navigation';
 

const NavbarBottom = ( ) => {
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
          href={'/vendor/home'}
          className={layoutLinks}
          aria-selected={path == `/vendor/home`}
          > 
          <div className='col-span-1 grid text-xs justify-items-center'> 
            <HomeIcon
              className={layoutIcons}
            />
            Home
          </div> 
        </Link>
        <Link 
          href={'/vendor/scanQrcode'} 
          className={layoutLinks}
          aria-selected={path == `/vendor/scanQrcode`}> 
          <div className={layoutIconBox}> 
            <QrCodeIcon
              className={layoutIcons}
            />
            Scan
          </div>  
        </Link>
        <Link 
          href={'/vendor/selectGifts' } 
          className={layoutLinks}
          aria-selected={path == `/vendor/selectGifts`}
        > 
          <div className={layoutIconBox}> 
            <SquaresPlusIcon
              className={layoutIcons}
              
            />
            Gifts
          </div> 
        </Link>
        <Link 
          href={'/vendor/stats' }  
          className={layoutLinks}
          aria-selected={path == `/vendor/stats`}
          > 
          <div className={layoutIconBox}> 
            <ChartBarSquareIcon
              className={layoutIcons}
              
            />
            Stats 
          </div> 
        </Link>
        <button onClick = {() => status === "connected" ? open({view: "Account"}) : open({view: 'Connect'})} className={layoutLinks} > 
          <div className={layoutIconBox}> 
            <ArrowRightOnRectangleIcon
              className={layoutIcons}
            />
            Login 
          </div> 
        </button>
    </header>
  );
}

export default NavbarBottom;