// "use client"; // NB: normally you would not do this, but I need redux here for 
// notification area, and otherwise it will not load... 

import '../globals.css'
import NavbarTop from "./components/NavbarTop"; 
import NavbarBottom from './components/NavbarBottom';
import { ModalMain } from './components/ModalMain';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (   
 
    <div className="h-dvh w-dvh grid grid-cols-1 justify-items-center bg-slate-100 overflow-hidden">
      <NavbarTop/>
        <div className="absolute flex justify-center w-full h-full max-w-4xl">  
            <ModalMain>
              {children}
            </ModalMain>
            <NavbarBottom/>
          </div>
      </div>

  )
}



