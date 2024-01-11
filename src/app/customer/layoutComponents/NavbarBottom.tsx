"use client";

import Link from 'next/link';
import { 
  ArrowRightOnRectangleIcon, 
  GiftIcon, 
  SquaresPlusIcon,
  QrCodeIcon,
  ChartBarSquareIcon
 } from '@heroicons/react/24/outline'
import { useScreenDimensions } from '../../hooks/useScreenDimensions';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useUrlProgramAddress } from '../../hooks/useUrl';

const NavbarBottom = ( ) => {
  const dimensions = useScreenDimensions();  
  const layoutLinks: string = 'py-1 px-6 text-gray-600 hover:text-blue-500 focus:text-blue-500 grid grid-cols-1'
  const layoutIconBox: string = 'col-span-1 grid text-xs justify-items-center'
  const layoutIcons: string = 'h-7 w-7'
  const { address } = useAccount() 
  const { open, close } = useWeb3Modal()
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()

  return (
    dimensions.width >= 896 ? 
    null
    :
    <header className="absolute bottom-0 z-10 flex justify-between h-12 w-full bg-stone-50/75 text-sm border-t border-gray-400 px-4">
      
        <Link href={progAddress ? `/customer/home?prog=${progAddress}` : '/customer/home'}  className={layoutLinks}> 
          <div className='col-span-1 grid text-xs justify-items-center'> 
            <QrCodeIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Home
          </div> 
        </Link>
        <Link href={progAddress ? `/customer/claim?prog=${progAddress}` : '/customer/home' } className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <SquaresPlusIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Claim
          </div> 
        </Link>
        <Link href={progAddress ? `/customer/redeem?prog=${progAddress}` : '/customer/home' }  className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <GiftIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Redeem 
          </div> 
        </Link>
        <Link href={progAddress ? `/customer/transactions?prog=${progAddress}` : '/customer/home'} className={layoutLinks}> 
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