// "use client"; // NB: normally you would not do this, but I need redux here for 
// notification area, and otherwise it will not load... 

import '../globals.css'
import NavbarTop from "../components/NavbarTop"; 
import NavbarBottom from '../components/NavbarBottom';
import { DynamicLayout } from './vendorComponents/DynamicLayout';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (   
    <div className="h-dvh w-dvh grid grid-cols-1 justify-items-center bg-slate-100 overflow-hidden bg-slate-200 dark:bg-slate-800">
        <NavbarTop selection = {"vendor"}/>
          <div className="absolute flex justify-center w-full h-full max-w-4xl overflow-hidden bg-slate-200 dark:bg-slate-800 ">  
              <DynamicLayout>
                {children}
              </DynamicLayout>
              <NavbarBottom selection = {"vendor"}/>
            </div>
      </div>
  )
}



