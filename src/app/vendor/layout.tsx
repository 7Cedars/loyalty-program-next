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
        <div className="relative h-screen w-full grid grid-cols-1 border-2 border-blue-500">
          <NavbarTop/>
            <div className='flex justify-center'>  
                {children}
                <NavbarBottom/>
              </div>
          </div>
    </main>
  )
}


