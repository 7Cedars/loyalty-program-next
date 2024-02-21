'use client'
 
import { parseEthAddress } from '@/app/utils/parsers'
import { selectLoyaltyProgram } from '@/redux/reducers/loyaltyProgramReducer'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
 
export default function UrlToRedux() {
  const params = useSearchParams();
  const dispatch = useDispatch() 
  const progAddress = params.get('prog')

  console.log("progAddress: ", progAddress)

  if (progAddress) {
    dispatch(selectLoyaltyProgram({programAddress: parseEthAddress(progAddress)}))
  }

  return (
    <div className="flex items-center justify-center h-full">
        <div className="grow flex items-center justify-center text-slate-800 dark:text-slate-200 z-40">
          <Image
            className="rounded-lg mx-3 animate-spin"
            width={60}
            height={60}
            src={"/images/loading2.svg"}
            alt="Loading icon"
          />
        </div>
      </div>
  )
}


