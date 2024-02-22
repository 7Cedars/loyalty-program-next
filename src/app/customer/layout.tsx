"use client"; // NB: normally you would not do this, but I need redux here for 
// notification area, and otherwise it will not load... 

import '../globals.css'
import NavbarTop from "./components/NavbarTop"; 
import NavbarBottom from './components/NavbarBottom';
import { DynamicLayout } from './components/DynamicLayout';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="absolute flex h-full w-full grid grid-cols-1 justify-items-center bg-slate-100 overflow-hidden">
      {children}
    </div>
  )
}



