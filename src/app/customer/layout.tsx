"use client"; // NB: normally you would not do this, but I need redux here for 
// notification area, and otherwise it will not load... 

import '../globals.css'
import NavbarTop from "./customerComponents/NavbarTop"; 
import NavbarBottom from './customerComponents/NavbarBottom';
import { DynamicLayout } from './customerComponents/DynamicLayout';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="absolute flex h-full w-full grid grid-cols-1 justify-items-center bg-slate-100 overflow-hidden">
       <DynamicLayout>
        {children}
      </DynamicLayout>
    </div>
  )
}



