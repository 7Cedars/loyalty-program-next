"use client";

import Link from 'next/link';
import { NotificationDialog } from '../ui/notificationDialog';
import { notification } from '@/redux/reducers/notificationReducer';
import { 
  ArrowRightOnRectangleIcon, 
  GiftIcon, 
  SquaresPlusIcon,
  QrCodeIcon,
  ChartBarSquareIcon
 } from '@heroicons/react/24/outline'
import { useScreenDimensions } from '../hooks/useScreenDimensions';
import { useDispatch } from 'react-redux';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { updateNotificationVisibility } from '@/redux/reducers/notificationReducer';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useUrlProgramAddress } from '../hooks/useUrl';

const NavbarBottom = ( ) => {
  const dimensions = useScreenDimensions();  
  const layoutLinks: string = 'py-1 px-6 text-gray-600 hover:text-gray-900 grid grid-cols-1'
  const layoutIconBox: string = 'col-span-1 grid text-xs justify-items-center'
  const layoutIcons: string = 'h-7 w-7'
  const dispatch = useDispatch() 
  const { address } = useAccount() 
  const { open, close } = useWeb3Modal()
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()


  return (
    dimensions.width >= 896 ? 
    null
    :
    <header className="absolute bottom-0 z-10 flex justify-between h-12 w-full bg-stone-50/75 text-sm border-t border-gray-400 ps-8 pe-8">
      
        <Link href={progAddress ? `/vendor/home?prog=${progAddress}` : '/vendor/home'}  className={layoutLinks}> 
          <div className='col-span-1 grid text-xs justify-items-center'> 
            <QrCodeIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Home
          </div> 
        </Link>
        <Link href={progAddress ? `/vendor/scanQrcode?prog=${progAddress}` : '/vendor/scanQrcode'} className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <GiftIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Gifts
          </div>  
        </Link>
        <Link href={progAddress ? `/vendor/selectTokens?prog=${progAddress}` : '/vendor/selectTokens' } className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <SquaresPlusIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Tokens
          </div> 
        </Link>
        <Link href={progAddress ? `/vendor/stats?prog=${progAddress}` : '/vendor/stats' }  className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <ChartBarSquareIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Stats 
          </div> 
        </Link>
        <button className="flex items-center divide-x p-3 divide-gray-400" onClick = {() => open(address ? {view: "Account"} : {view: "Networks"} )}> 
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