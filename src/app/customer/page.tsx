"use client"; 
import React from 'react';
import { useRef } from 'react';
import { useScreenDimensions } from '../hooks/useScreenDimensions';
import { useAppDispatch } from '@/redux/hooks';
import { ScreenDimensions } from '@/types';
import { updateScreenDimensions } from '@/redux/reducers/userInputReducer';

export default function Page() {
   

  return (    
    <div>
      <div className='mt-2 w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
        One
      </div>
      
      <div className='mt-2 flex-grow space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        Two
      </div> 
    </div> 
  );
}
