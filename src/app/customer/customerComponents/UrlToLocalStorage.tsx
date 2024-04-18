'use client'
 
// import { parseEthAddress } from '@/app/utils/parsers'
// import { selectLoyaltyProgram } from '@/redux/reducers/loyaltyProgramReducer'
// import { useDispatch } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
 
export default function UrlToLocalStorage() {
  const params = useSearchParams();
  const progAddress = params.get('prog') // parseEthAddress
  const progUri = params.get('proguri')  

  const checked = useRef<boolean>(false)

  useEffect(() => {
    if (
      progAddress && 
      progUri && 
      !checked.current && 
      typeof window !== 'undefined'
      ) {
      localStorage.setItem("progAddress", progAddress)
      localStorage.setItem("progUri", progUri)
      window.dispatchEvent(new Event("localStorageUpdated"));
      checked.current = true
    }
  }, [ ])


  // useEffect(() => {
  //   if (status == "isSuccess" && loyaltyPrograms) dispatch(selectLoyaltyProgram(loyaltyPrograms[0]))
  // }, [status])

  return (
    <>
    <Image
      className="rounded-lg m-6 animate-spin opacity-100 aria-hidden:opacity-0"
      width={45}
      height={45}
      src={"/images/loading2.svg"}
      alt="Loading icon"
      aria-hidden = {checked.current}
    />     
    </>
  )
}


