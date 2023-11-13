"use client"; 
import { useRef } from 'react';
import { useDimensions } from '../hooks/useDimensions';
import { useAppDispatch } from '@/redux/hooks';
import { ScreenDimensions } from '@/types';
import { updateScreenDimensions } from '@/redux/reducers/userInputReducer';

export default function Page() {
  const dispatch = useAppDispatch() 

  const divRef = useRef<HTMLDivElement>(null);
  const screenDimensions: ScreenDimensions = useDimensions(divRef);

  dispatch(updateScreenDimensions(screenDimensions)); 

  return (    
    <>
      <div className='mt-20 w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
        One
      </div>
      
      <div className='mt-20 flex-grow space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        Two
      </div> 
    </> 
  );
}
