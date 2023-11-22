"use client";

import { notification } from '@/redux/reducers/notificationReducer';
import Link from 'next/link';
import { NotificationDialog } from '../ui/notificationDialog';
import { 
  ArrowRightOnRectangleIcon, 
  GiftIcon, 
  DocumentArrowDownIcon, 
  SquaresPlusIcon,
  QrCodeIcon,
  ChartBarSquareIcon
 } from '@heroicons/react/24/outline'
import { useScreenDimensions } from '../hooks/useScreenDimensions';

const NavbarBottom = ( ) => {
  const dimensions = useScreenDimensions();  
  const layoutLinks: string = 'py-1 px-6 text-gray-600 hover:text-gray-900 grid grid-cols-1'
  const layoutIconBox: string = 'col-span-1 grid text-xs justify-items-center'
  const layoutIcons: string = 'h-7 w-7'

  return (
    dimensions.width >= 896 ? 
    null
    :
    <header className="absolute bottom-0 z-10 flex justify-between h-12 w-full bg-stone-50/75 text-sm border-t border-gray-400 ps-8 pe-8">
      
        <Link href='/vendor/landing' className={layoutLinks}> 
          <div className='col-span-1 grid text-xs justify-items-center'> 
            <QrCodeIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Home
          </div> 
        </Link>
        <Link href='/vendor/scanQrcode' className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <GiftIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Gift & Redeem
          </div>  
        </Link>
        <Link href='/vendor/selectTokens'   className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <SquaresPlusIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Tokens
          </div> 
        </Link>
        <Link href='/vendor/stats'  className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <ChartBarSquareIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Stats 
          </div> 
        </Link>
        <Link href='/vendor/login' className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <ArrowRightOnRectangleIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Login 
          </div> 
        </Link>
    </header>
  );
}

export default NavbarBottom;