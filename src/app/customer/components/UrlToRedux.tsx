'use client'
 
import { parseEthAddress } from '@/app/utils/parsers'
import { selectLoyaltyProgram } from '@/redux/reducers/loyaltyProgramReducer'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useLoyaltyPrograms } from '@/app/hooks/useLoyaltyPrograms'
import { Button } from '@/app/ui/Button'
 
export default function UrlToRedux() {
  const params = useSearchParams();
  const dispatch = useDispatch() 
  const progAddress = params.get('prog')
  const checked = useRef<boolean>(false)
  const {status, loyaltyPrograms, fetchPrograms} = useLoyaltyPrograms()

  console.log("progAddress: ", progAddress)

  if (progAddress && !checked.current) {
    fetchPrograms([{programAddress: parseEthAddress(progAddress)}])
    checked.current = true
  }

  useEffect(() => {
    if (status == "isSuccess" && loyaltyPrograms) dispatch(selectLoyaltyProgram(loyaltyPrograms[0]))
  }, [status])

  return (
    // <div className="grid grid-cols-1 w-full justify-items-center content-center z-10">
    //     <div className="w-64 h-48 grid grid-cols-1 text-slate-200 dark:text-slate-200 z-40 border-2 border-slate-200 bg-slate-700 ">
          <Image
            className="rounded-lg mx-3 animate-spin"
            width={30}
            height={30}
            src={"/images/loading2.svg"}
            alt="Loading icon"
          />

        //   <a 
        //   href="/customer/home" 
        //   className="h-16 flex mx-3 opacity-100 aria-hidden:opacity-0 transition-all delay-300 duration-1000 z-15"
        //   aria-hidden = {status != "isSuccess"}
        //   >
        //   <Button appearance="grayEmptyLight" onClick={() => {}}>
        //     Enter Loyalty Card
        //   </Button>
        // </a> 
        // </div>
        
        // {/* { loyaltyPrograms ? 
        // <div> 
        //   PROGRAMS LOADED 
        // </div>
        // :
        // <div> 
        //   NADAS
        // </div>
        // } */}

      // </div>
  )
}


