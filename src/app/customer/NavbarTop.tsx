"use client";

import { notification } from '@/redux/reducers/notificationReducer';
import Link from 'next/link';
import { useRef } from 'react';
import { updateScreenDimensions } from '@/redux/reducers/userInputReducer';
import { useAppDispatch } from '@/redux/hooks';
import { ScreenDimensions } from '@/types';
import { useScreenDimensions } from '../hooks/useScreenDimensions';

const NavbarTop = ( ) => {

  const dimensions: ScreenDimensions = useScreenDimensions();
  const layoutLinks: string = 'p-1 px-6 text-gray-600 hover:text-gray-900'

    return (
      dimensions.width / dimensions.height < 1 ? 
      null 
      :
      <header className="absolute top-0 flex justify-between h-18 w-full text-sm border-b border-gray-400 py-0">
        <div className="flex divide-x p-3 divide-gray-400">
          <Link href='/customer/landing' className={layoutLinks}> Home </Link>
          <Link href='/customer/points'  className={layoutLinks}> Points </Link>
          <Link href='/customer/claim'   className={layoutLinks}> Claim tokens </Link>
          <Link href='/customer/redeem'  className={layoutLinks}> Redeem tokens </Link>
        </div> 
        <div className="flex divide-x p-3 divide-gray-400"> 
          <Link href='/customer/login' className={layoutLinks}> Login </Link>
        </div>

      </header>
      );
    }


export default NavbarTop;