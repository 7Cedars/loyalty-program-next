'use client'
 
import { useUrlProgramAddress } from '@/app/hooks/useUrl'
import { LoyaltyProgram } from '@/types'
import { useLoyaltyPrograms } from '@/app/hooks/useLoyaltyPrograms'
import { parseEthAddress } from '@/app/utils/parsers'
import { selectLoyaltyProgram } from '@/redux/reducers/loyaltyProgramReducer'
import { useDispatch } from 'react-redux'
 
export default function UrlToRedux() {
  const {progAddress} = useUrlProgramAddress()
  const { status, loyaltyPrograms, fetchPrograms } = useLoyaltyPrograms()
  const loyaltyProgramAddress: LoyaltyProgram = {programAddress: parseEthAddress(progAddress)}
  const dispatch = useDispatch() 

  console.log("loyaltyProgramAddress: ", loyaltyProgramAddress)

  if (loyaltyProgramAddress) fetchPrograms([loyaltyProgramAddress])

  if (status == "isSuccess" && loyaltyPrograms) {
    console.log("loyaltyPrograms: ", loyaltyPrograms)
    dispatch(selectLoyaltyProgram(loyaltyPrograms[0]))
  }

  return <> Loading .... </>
}


