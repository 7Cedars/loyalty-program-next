"use client";

import Link from 'next/link';
import { NotificationDialog } from '../../ui/notificationDialog';
import { notification } from '@/redux/reducers/notificationReducer';
import { 
  ArrowRightOnRectangleIcon, 
  GiftIcon, 
  SquaresPlusIcon,
  QrCodeIcon,
  HomeIcon, 
  ChartBarSquareIcon
 } from '@heroicons/react/24/outline'
import { useScreenDimensions } from '../../hooks/useScreenDimensions';
import { useDispatch } from 'react-redux';
import { useAccount, useWalletClient } from 'wagmi';
import { useEffect } from 'react';
import { updateNotificationVisibility } from '@/redux/reducers/notificationReducer';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useUrlProgramAddress } from '../../hooks/useUrl';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { pathToFileURL } from 'url';

const NavbarBottom = ( ) => {
  const dimensions = useScreenDimensions();  
  const layoutLinks: string = 'py-1 px-6 text-slate-400 aria-selected:text-slate-800 aria-selected:text-slate-800 dark:text-slate-600 dark:aria-selected:text-slate-200 dark:aria-selected:text-slate-200 grid grid-cols-1'
  const layoutIconBox: string = 'col-span-1 grid text-xs justify-items-center'
  const layoutIcons: string = 'h-7 w-7'
  const { address } = useAccount() 
  const { open, close } = useWeb3Modal()
  const path = usePathname()
  const { progAddress } = useUrlProgramAddress()
  const { data: walletClient, status } = useWalletClient();

  // const handleLogin = () => {
  //   walletClient ? open({view: "Account"}) : open({view: "Networks"})
  // }

  console.log("walletClient: ", walletClient)

  return (
    dimensions.width >= 896 ? 
    null
    :
    <header className="absolute bottom-0 z-10 flex justify-between h-12 w-full bg-slate-100/75 dark:bg-slate-900/75 text-sm border-t border-gray-400 px-4">
      
        <Link 
          href={progAddress ? `/vendor/home?prog=${progAddress}` : '/vendor/home'}
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
          href={progAddress ? `/vendor/scanQrcode?prog=${progAddress}` : '/vendor/scanQrcode'} 
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
          href={progAddress ? `/vendor/selectGifts?prog=${progAddress}` : '/vendor/selectGifts' } 
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
          href={progAddress ? `/vendor/stats?prog=${progAddress}` : '/vendor/stats' }  
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
        <button onClick = {() => open({view: "Networks"})} className={layoutLinks} > 
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