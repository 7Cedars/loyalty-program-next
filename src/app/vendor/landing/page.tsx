"use client"; 
import {loyaltyProgramAbi} from "../../../context/abi" 
import { useAccount, usePublicClient } from 'wagmi'
import { useContractLogs } from '@/app/hooks/useContractLogs';
import { EthAddress, getContractEventsProps } from "@/types"
import { Log } from "viem";
import ShowQrcode from './ShowQrcode';
import { useDispatch } from "react-redux";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import { useLoyaltyProgramAddress } from "@/app/hooks/useUrl";
import { updateModalVisible } from "@/redux/reducers/userInputReducer";
import Link from "next/link";
import { useLoginAndProgram } from "@/app/hooks/useLoginAndPrograml";
import { parseEthAddress } from "@/app/utils/parsers";
import { useState, useRef, useEffect } from "react";
import { parseUri } from "@/app/utils/parsers";

export default function Page()  {

  const { loggedIn, validProgram, data, indexProgram  } = useLoginAndProgram()  
  const dispatch = useDispatch() 
  const { progAddress, handleProgAddress } = useLoyaltyProgramAddress()
  const publicClient = usePublicClient()
  const uris = useRef<Array<string>>() 
  const metadataPrograms = useRef<Array<object>>() 
  const tempData: string[] = ["0x8464135c8f25da09e49bc8782676a84730c318bc", "0xbc9129dc0487fc2e169941c75aabc539f208fb01", "0x663f3ad617193148711d28f5334ee4ed07016602"]
  
  const getUris = async(address: EthAddress) => {
    const uri = await publicClient.readContract({
      address: address, 
      abi: loyaltyProgramAbi,
      functionName: 'uri',
      args: [0]
    })
    return uri
  }
 
  const collectUriMetadata = async() => {
      uris.current = [];  
      for await (const address of tempData) {
        // step 1: get & save Uris for metadata
        const data: unknown = await getUris(parseEthAddress(address)) 
        const uriMetadata = parseUri(data)
        // step 2: get & save metadata
        const fetchedMetadata: unknown = await (await fetch(uriMetadata)).json()

        console.log("fetchedMetadata: ", fetchedMetadata)
        if (uriMetadata) {
          uris.current.push(uriMetadata) 
        }
      }
    }
  
  useEffect(() => {
    collectUriMetadata() 
  }, [])
  
  console.log("uriData.current: ", uris.current)

  return (
    <div className="grid grid-rows-1 grid-flow-col overflow-x-scroll overscroll-auto m-12"> 
    {
      tempData.map(item => {

        return (
          <div 
            key={item}
            className="ms-20 mt-20 w-96 h-128 border-2 border-red-500"
            > {item} 
          </div>
        )
      })
    }
      <div className="ms-20 mt-20 w-96 h-128 border-2 border-green-500"> 

        And here comes an onboarding link 

      </div> 
    </div>

  ) 

  // if (indexProgram != -1) {
  //   return <ShowQrcode componentData = {data} selection = {indexProgram} /> // NB! 
  // } else {
  //     if (data.length == 0) {
  //       return (
  //         <div> Zero deployed contracts. Invite to deploy program here </div>
  //       )
  //     }
  //     if (data.length == 1) {
  //       dispatch(notification({
  //         id: "NotOwnerProgram",
  //         message: `You do not own selected loyalty program, redirecting...`, 
  //         colour: "yellow", 
  //         isVisible: true
  //       })); 

  //       handleProgAddress(data[0].address)

  //     }
  //     if (data.length > 1) {
  //       dispatch(notification({
  //         id: "NotOwnerProgram",
  //         message: `You do not own selected loyalty program, redirecting...`, 
  //         colour: "yellow", 
  //         isVisible: true
  //       })); 
  //         return ( 
  //           <div> Multiple deployed contracts. choose </div>
  //         )
  //     }
  // }

}
