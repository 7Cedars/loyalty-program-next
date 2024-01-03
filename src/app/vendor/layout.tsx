// "use client"; // NB: normally you would not do this, but I need redux here for 
// notification area, and otherwise it will not load... 

import '../globals.css'
import NavbarTop from "./NavbarTop"; 
import NavbarBottom from './NavbarBottom';
import { ModalMain } from './components/ModalMain';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (   
 
    <div className="relative h-screen w-full grid grid-cols-1 justify-items-center bg-slate-100">
      <NavbarTop/>
        <div className="flex justify-center w-full max-h-screen max-w-4xl">  
            <ModalMain>
              {children}
            </ModalMain>
            <NavbarBottom/>
          </div>
      </div>

  )
}



