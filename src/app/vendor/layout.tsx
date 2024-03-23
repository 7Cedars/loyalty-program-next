// "use client"; // NB: normally you would not do this, but I need redux here for 
// notification area, and otherwise it will not load... 

import '../globals.css'
import NavbarTop from "./components/NavbarTop"; 
import NavbarBottom from './components/NavbarBottom';
import { DynamicLayout } from './components/DynamicLayout';
import { Web3Modal } from '@/context/Web3ModalProvider';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (   
 
    <div className="h-dvh w-dvh grid grid-cols-1 justify-items-center bg-slate-100 overflow-hidden bg-slate-200 dark:bg-slate-800">
      {/* <Web3Modal>  */}
        <NavbarTop/>
          <div className="absolute flex justify-center w-full h-full max-w-4xl overflow-hidden bg-slate-200 dark:bg-slate-800 ">  
              <DynamicLayout>
                {children}
              </DynamicLayout>
              <NavbarBottom/>
            </div>
        {/* </Web3Modal> */}
      </div>

  )
}



