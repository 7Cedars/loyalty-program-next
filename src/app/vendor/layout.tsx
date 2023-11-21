import '../globals.css'
import NavbarTop from "./NavbarTop"; 
import NavbarBottom from './NavbarBottom';
import { ModalDialog } from '../ui/ModalDialog';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {

  return (   
    <div className="relative h-screen w-full grid grid-cols-1 justify-items-center bg-slate-100">
      <NavbarTop/>
        <div className="flex justify-center w-full max-h-screen max-w-4xl bg-cover bg-center bg-[url('/img/CoffeeShopLoyaltyProgramNft.svg')]">  
            <ModalDialog>
              {children}
            </ModalDialog>
            
            <NavbarBottom/>
          </div>
      </div>

  )
}



