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
        <div className="relative h-screen w-full grid grid-cols-1">
          <NavbarTop/>
            <div className='mt-14 flex justify-center w-full'>  
              <div className='w-full max-w-screen-lg'>
                {children}
                <NavbarBottom/>
              </div>
            </div> 

          </div>
    </main>
  )
}


