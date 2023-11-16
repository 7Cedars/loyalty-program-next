import '../globals.css'
import NavbarTop from "./NavbarTop"; 
import NavbarBottom from './NavbarBottom';

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {

  return (   
    <main>
        <div className="relative h-screen w-full grid grid-cols-1 justify-items-center bg-slate-100">
          <NavbarTop/>
            <div className="flex justify-center w-full max-h-full max-w-4xl bg-cover bg-center bg-[url('/img/CoffeeShopLoyaltyProgramNft.svg')]">  

                {children}

                <NavbarBottom/>
              </div>
          </div>
    </main>
  )
}



