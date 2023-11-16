"use client";

import { notification } from '@/redux/reducers/notificationReducer';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { ScreenDimensions } from '@/types';
import { useScreenDimensions } from '../hooks/useScreenDimensions';

const NavbarTop = ( ) => {
  const dimensions = useScreenDimensions();
  const layoutLinks: string = 'p-1 px-6 text-gray-600 hover:text-gray-900'

    return (
      dimensions > 1 ? 
      null 
      :
      <header className="absolute top-0 z-10 flex justify-between h-18 w-full text-sm border-b border-gray-400 bg-slate-50 px-6">
        <div className="flex divide-x p-3 divide-gray-400">
          <Link href='/vendor/landing' className={layoutLinks}> Home </Link>
          <Link href='/vendor/giftPoints'  className={layoutLinks}> Gift Points </Link>
          <Link href='/vendor/selectTokens'  className={layoutLinks}> Select tokens </Link>
          <Link href='/vendor/stats'  className={layoutLinks}> Stats </Link>
        </div> 
        <div className="flex divide-x p-3 divide-gray-400"> 
          <Link href='/vendor/login' className={layoutLinks}> Login </Link>
        </div>

      </header>
      );
    }


export default NavbarTop;