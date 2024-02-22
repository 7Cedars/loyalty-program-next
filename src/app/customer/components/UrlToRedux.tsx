'use client'
 
import { parseEthAddress } from '@/app/utils/parsers'
import { selectLoyaltyProgram } from '@/redux/reducers/loyaltyProgramReducer'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useLoyaltyPrograms } from '@/app/hooks/useLoyaltyPrograms'
 
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
    <>
    <Image
      className="rounded-lg m-6 animate-spin opacity-100 aria-hidden:opacity-0"
      width={45}
      height={45}
      src={"/images/loading2.svg"}
      alt="Loading icon"
      aria-hidden = {status == "isSuccess"}
    />
    {loyaltyPrograms ? 
    <div>
      {loyaltyPrograms[0].programAddress}
      {loyaltyPrograms[0].uri}
      {loyaltyPrograms[0].programOwner}
    </div>
    :
    null
    }
     
    </>
  )
}


