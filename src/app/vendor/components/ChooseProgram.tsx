import { useAccount } from 'wagmi'
import { LoyaltyProgram, Status } from "@/types";
import { TitleText } from "../../ui/StandardisedFonts";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUrlProgramAddress } from '../../hooks/useUrl';
import { usePublicClient } from 'wagmi';
import { loyaltyProgramAbi } from '@/context/abi';
import { Log } from 'viem';
import { parseContractLogs, parseUri, parseMetadata } from '../../utils/parsers';
import { useDispatch } from 'react-redux';
import { selectLoyaltyProgram } from '@/redux/reducers/loyaltyProgramReducer';
import { useLoyaltyPrograms } from '@/app/hooks/useLoyaltyPrograms';

export default function ChooseProgram()  {
  const { status, loyaltyPrograms, fetchPrograms } = useLoyaltyPrograms()
  const dispatch = useDispatch() 
  const { putProgAddressInUrl } = useUrlProgramAddress()

  useEffect(() => {
    if (!loyaltyPrograms) fetchPrograms()
  }, [, loyaltyPrograms ]) 

  useEffect(() => {
    if (
      status == "isSuccess" && 
      loyaltyPrograms && 
      loyaltyPrograms.length == 1 && 
      loyaltyPrograms.findIndex(loyaltyProgram => loyaltyProgram.metadata) !== -1
      ) 
        handleProgramSelection(loyaltyPrograms[0])
  }, [status, loyaltyPrograms])

  const handleProgramSelection = (loyaltyProgram: LoyaltyProgram) => {
    putProgAddressInUrl(loyaltyProgram.programAddress)
    dispatch(selectLoyaltyProgram(loyaltyProgram))
  }

  // Choosing program. -- This is what I have to get working 100% 
  return (
     <div className='w-full h-full grid grid-cols-1 justify-items-center' >
      <div> 
      <TitleText title = "Choose Loyalty Program" subtitle="Choose existing program or deploy a new one." size={1} /> 
      </div> 
       <div className="grid grid-rows-1 grid-flow-col h-full overflow-x-scroll overscroll-auto mb-12"> 
        
        { status == "isSuccess" && loyaltyPrograms && loyaltyPrograms.length > 0 ? 
          loyaltyPrograms.map(program => {

            return (
              <button 
                key={program.programAddress}
                onClick = {() => handleProgramSelection(program)}
                  className="me-20 mt-12 w-72 h-128"> 
                      <Image
                        className="rounded-lg"
                        width={288}
                        height={420}
                        style = {{ objectFit: "cover" }} 
                        src={program.metadata? program.metadata.imageUri : `/vercel.svg`}
                        alt="DAO space icon"
                      />
              </button>
            )
          })
          : 
          status == "isLoading" ? 
          <div className='w-full h-full grow grid grid-cols-1 gap-1 justify-items-center text-center italic' >
          ... Loading  
          </div>
          :
          <div className='w-full h-full grow grid grid-cols-1 gap-1 justify-items-center text-center italic' >
          <div className='h-48'>
              <div >
                No Loyalty Programs found on this address. 
              </div> 
              <div >
                Login with another address or deploy a program <a href="/" className='text-blue-500 underline '> here. </a>
              </div> 
            </div> 
          </div>
      } 

      </div>
    </div>
  
    ) 
} 