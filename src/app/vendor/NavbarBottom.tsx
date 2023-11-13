"use client";

import { notification } from '@/redux/reducers/notificationReducer';
import Link from 'next/link';
import { NotificationDialog } from '../ui/notificationDialog';
import { 
  Cog6ToothIcon, 
  DocumentArrowDownIcon, 
  DocumentArrowUpIcon,
  QrCodeIcon,
  CircleStackIcon
 } from '@heroicons/react/24/outline'
import { useScreenDimensions } from '../hooks/useScreenDimensions';

const NavbarBottom = ( ) => {
  const dimensions = useScreenDimensions();  
  const layoutLinks: string = 'py-1 px-6 text-gray-600 hover:text-gray-900 grid grid-cols-1'
  const layoutIconBox: string = 'col-span-1 grid text-xs justify-items-center'
  const layoutIcons: string = 'h-7 w-7'

  return (
    dimensions.width / dimensions.height >= 1 ? 
    null
    :
    <header className="absolute bottom-0 flex justify-between h-12 w-full max-w-screen-lg text-sm border-t border-gray-400 ps-8 pe-8">
      
        <Link href='/customer/landing' className={layoutLinks}> 
          <div className='col-span-1 grid text-xs justify-items-center'> 
            <QrCodeIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Home
          </div> 
        </Link>
        <Link href='/customer/points'  className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <CircleStackIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Points
          </div>  
        </Link>
        <Link href='/customer/claim'   className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <DocumentArrowDownIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Claim 
          </div> 
        </Link>
        <Link href='/customer/redeem'  className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <DocumentArrowUpIcon
              className={layoutIcons}
              aria-hidden="true"
            />
            Redeem 
          </div> 
        </Link>
        <Link href='/login' className={layoutLinks}> 
          <div className={layoutIconBox}> 
            <Cog6ToothIcon
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