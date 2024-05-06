"use client";

import { LoyaltyProgram, Status} from "@/types";
import { TitleText } from "../../ui/StandardisedFonts";
import { useEffect, useState} from "react";
import Image from "next/image";
import { useDispatch } from 'react-redux';
import { selectLoyaltyProgram } from '@/redux/reducers/loyaltyProgramReducer';
import { useLoyaltyPrograms } from '@/app/hooks/useLoyaltyPrograms';
import { useAccount, usePublicClient } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log, keccak256, toHex } from "viem";
import { parseContractLogs } from "@/app/utils/parsers";
import { SUPPORTED_CHAINS, VERSION_PROGRAM } from "@/context/constants";

export default function ChooseProgram()  {
  const { status: statusUseLoyaltyPrograms, loyaltyPrograms, fetchPrograms } = useLoyaltyPrograms()
  const [ statusFetchingAddresses, setStatusFetchingAddresses ] = useState<Status>("isIdle")
  const [ status, setStatus ] = useState<Status>("isIdle")
  const [ addresses, setAddresses ] = useState<LoyaltyProgram[] | undefined>() 
  const { address, chain } = useAccount() 
  const publicClient = usePublicClient(); 
  const dispatch = useDispatch() 

  const getLoyaltyProgramAddresses = async () => {
    setStatusFetchingAddresses("isLoading")
    if (publicClient && chain)
    try {
      const selectedChain: any = SUPPORTED_CHAINS.find(block => block.chainId === chain.id)
      const loggedAdresses: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
          eventName: 'DeployedLoyaltyProgram', 
          args: { owner: address }, 
          fromBlock: selectedChain?.fromBlock
      });
      const loyaltyProgramAddresses = parseContractLogs(loggedAdresses)
      setAddresses(loyaltyProgramAddresses)
      setStatusFetchingAddresses("isSuccess")
    } catch (error) { 
      setStatusFetchingAddresses("isError")
      console.log(error)
    }
  }
  
  // updating status 
  useEffect(() => {
    if (
      statusUseLoyaltyPrograms == "isLoading" || 
      statusFetchingAddresses == "isLoading"
    ) setStatus("isLoading")
    if (
      statusUseLoyaltyPrograms == "isError" || 
      statusFetchingAddresses == "isError"
    ) setStatus("isError")
    if (
      statusUseLoyaltyPrograms == "isSuccess" && 
      statusFetchingAddresses == "isSuccess"
    ) setStatus("isSuccess")
  }, [ statusUseLoyaltyPrograms, statusFetchingAddresses ])

  useEffect(() => {
    if (address && !addresses)  getLoyaltyProgramAddresses() 
    if (addresses && !loyaltyPrograms) fetchPrograms(addresses)
  }, [, loyaltyPrograms, addresses, address ]) 

  useEffect(() => {
    if (
      statusUseLoyaltyPrograms == "isSuccess" && 
      loyaltyPrograms && 
      loyaltyPrograms.length == 1 && 
      loyaltyPrograms.findIndex(loyaltyProgram => loyaltyProgram.metadata) !== -1
      ) 
      dispatch(selectLoyaltyProgram(loyaltyPrograms[0]))
  }, [statusUseLoyaltyPrograms, loyaltyPrograms])

  return (
     <div className='w-full h-full flex flex-col items-center justify-center' >
      <div> 
      <TitleText title = "Choose Loyalty Program" subtitle="Choose existing program or deploy a new one." size={1} /> 
      </div> 
       { status == "isSuccess" && loyaltyPrograms && loyaltyPrograms.length > 0 && address ? 
        <div className="relative my-6 mx-4 flex flex-col justify-center sm:w-4/5 w-full h-full">
            <div className="flex flex-row justify-between overflow-x-auto overflow-hidden scroll-px-1 snap-normal w-full h-full self-center">

            { loyaltyPrograms.map(program =>  
            <div
              key={program.programAddress}
              className="carousel-item h-96 w-52 text-center items-center snap-start ml-4 flex flex-col self-center">
              <button 
                onClick = {() =>  dispatch(selectLoyaltyProgram(program))}
                  className="w-11/12 z-0 h-96 w-52 max-h-80 max-w-48 self-center m-1"> 
                      <Image
                        className="h-90 w-48 self-center rounded-lg" 
                        width={400}
                        height={600}
                        style = {{ objectFit: "cover" }} 
                        src={program.metadata? program.metadata.imageUri : `/images/loading2.svg`}
                        alt="Loyalty Program Card"
                      />
                </button>
              </div>
            )}
            </div>
          </div>
          : 
          status == "isLoading" ? 
            <div className="grow flex flex-col self-center items-center justify-center">
              <Image
                className="rounded-lg flex-none mx-3 animate-spin self-center"
                width={60}
                height={60}
                src={"/images/loading2.svg"}
                alt="Loading icon"
              />
              <div className="text-center text-slate-500 mt-6">
                Retrieving your programs... 
              </div> 
            </div>
          :
          address ?
            <div className='grow flex flex-col self-center items-center justify-center text-center text-slate-800 dark:text-slate-200' >
              {/* <div className='h-48 max-w-48'> */}
                  <div className="w-48 m-2">
                    Please wait..  
                  </div> 
                  <div className="w-96 m-2">
                    If this message does not disappear after ten seconds, it is likely that no loyalty programs were deployed with this wallet address. 
                  </div>
                  <div className="w-96 m-2">  
                    Login with another address or deploy a new program <a href="/" className='text-blue-500 underline '> here. </a>
                  </div> 
                {/* </div>  */}
            </div>
          : 
          <div className="grow" />
      } 

      </div>
    ) 
} 