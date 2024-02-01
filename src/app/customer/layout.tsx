// "use client"; // NB: normally you would not do this, but I need redux here for 
// notification area, and otherwise it will not load... 

import '../globals.css'
import NavbarTop from "./layoutComponents/NavbarTop"; 
import NavbarBottom from './layoutComponents/NavbarBottom';
import { ModalMain } from './layoutComponents/ModalMain';
import Image from 'next/image';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (   
 
    <div className="absolute flex h-full w-full grid grid-cols-1 justify-items-center bg-slate-100 overflow-hidden">     
      <NavbarTop/>
        <div className="grow justify-center w-full h-full max-w-4xl overflow-y-scroll">  
          
            <ModalMain>
              {children}
            </ModalMain>
           
            <NavbarBottom/>
          </div>
      </div>

  )
}



