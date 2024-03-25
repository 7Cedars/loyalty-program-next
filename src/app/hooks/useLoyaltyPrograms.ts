// Custom hook loading all available Loyalty token included in a whitelist.. 
// Note that the structure of this hook is a good standard way of creating hooks with
// multiple (sequenced) async calls. 

import { LoyaltyProgram,  Status } from "@/types";
import { useEffect, useRef, useState } from "react";
import { loyaltyProgramAbi } from "@/context/abi";
import { usePublicClient } from 'wagmi'
import { 
  parseUri, 
  parseMetadata, 
  parseEthAddress,
} from "@/app/utils/parsers";

export const useLoyaltyPrograms = () => {
  // const { address } = useAccount() 
  const publicClient = usePublicClient(); 

  const [ status, setStatus ] = useState<Status>("isIdle")
  const statusAtUri = useRef<Status>("isIdle") 
  const statusAtProgramOwner = useRef<Status>("isIdle") 
  const statusAtMetadata = useRef<Status>("isIdle") 
  const [ data, setData ] = useState<LoyaltyProgram[] | undefined>() 
  const [ loyaltyPrograms, setLoyaltyPrograms ] = useState<LoyaltyProgram[]>() 

  const fetchPrograms = (requestedPrograms: LoyaltyProgram[] ) => {
    setStatus("isIdle")
    setData(undefined)
    setLoyaltyPrograms(undefined)
    getLoyaltyProgramsUris(requestedPrograms)
  }

  const getLoyaltyProgramsUris = async (requestedPrograms: LoyaltyProgram[] ) => {
    statusAtUri.current = "isLoading" 

    let loyaltyProgram: LoyaltyProgram
    let loyaltyProgramsUpdated: LoyaltyProgram[] = []

    if (requestedPrograms && publicClient) { 
      try {
        for await (loyaltyProgram of requestedPrograms) {

          const uri: unknown = await publicClient.readContract({
            address: loyaltyProgram.programAddress, 
            abi: loyaltyProgramAbi,
            functionName: 'uri',
            args: [0]
          })
          loyaltyProgramsUpdated.push({...loyaltyProgram, uri: `${parseUri(uri)}`})
        }
        statusAtUri.current = "isSuccess" 
        setData(loyaltyProgramsUpdated)

        } catch (error) {
          statusAtUri.current = "isError" 
          console.log(error)
      }
    }
  }

  const getLoyaltyProgramOwner = async () => {
    statusAtProgramOwner.current = "isLoading" 

    let loyaltyProgram: LoyaltyProgram
    let loyaltyProgramsUpdated: LoyaltyProgram[] = []

    if (data && publicClient) {
      try {
        for await (loyaltyProgram of data) {
       
        const owner: unknown = await publicClient.readContract({
          address: parseEthAddress(loyaltyProgram.programAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'getOwner'
        })
        loyaltyProgramsUpdated.push({...loyaltyProgram, programOwner: `${parseEthAddress(owner)}`})
      }
      statusAtProgramOwner.current = "isSuccess" 
      setData(loyaltyProgramsUpdated) 
      } catch (error) {
        statusAtProgramOwner.current = "isError" 
        console.log(error)
      }
    }
  }

  const getLoyaltyProgramsMetaData = async () => {
    statusAtMetadata.current = "isLoading" 

    let loyaltyProgram: LoyaltyProgram
    let loyaltyProgramsUpdated: LoyaltyProgram[] = []

    if (data) { 
      try {
        for await (loyaltyProgram of data) {

          const fetchedMetadata: unknown = await(
            await fetch(parseUri(loyaltyProgram.uri))
            ).json()

          loyaltyProgramsUpdated.push({...loyaltyProgram, metadata: parseMetadata(fetchedMetadata)})
        }
        statusAtMetadata.current = "isSuccess" 
        setData(loyaltyProgramsUpdated)

        } catch (error) {
          statusAtMetadata.current = "isError" 
          console.log(error)
      }
    }
  }

  useEffect(() => {
    if ( 
      data && 
      statusAtUri.current == "isSuccess" && 
      statusAtProgramOwner.current == "isIdle" 
      ) getLoyaltyProgramOwner() 
    if ( 
      data && 
      statusAtProgramOwner.current == "isSuccess" && 
      statusAtMetadata.current == "isIdle" 
      ) getLoyaltyProgramsMetaData() 
  }, [ data  ])

  useEffect(() => {
    if (
      statusAtUri.current == "isSuccess" && 
      statusAtProgramOwner.current == "isSuccess" && 
      statusAtMetadata.current == "isSuccess"
      ) {
        setStatus("isSuccess")
        setLoyaltyPrograms(data)
      }
    if (
      statusAtUri.current == "isLoading" || 
      statusAtProgramOwner.current == "isLoading" || 
      statusAtMetadata.current == "isLoading"
      ) {
        setStatus("isLoading")
      }
  }, [ data ])

  return {status, loyaltyPrograms, fetchPrograms}
}