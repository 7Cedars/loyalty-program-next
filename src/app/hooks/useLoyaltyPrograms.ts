// Custom hook loading all available Loyalty token included in a whitelist.. 
// Note that the structure of this hook is a good standard way of creating hooks with
// multiple (sequenced) async calls. 

import { LoyaltyProgram,  Status } from "@/types";
import { useEffect, useRef, useState } from "react";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { useAccount, usePublicClient } from 'wagmi'
import { 
  parseUri, 
  parseMetadata, 
  parseContractLogs,
} from "@/app/utils/parsers";

export const useLoyaltyPrograms = () => {
  const { address } = useAccount() 
  const publicClient = usePublicClient(); 

  const [ status, setStatus ] = useState<Status>("isIdle")
  const statusAtAddresses = useRef<Status>("isIdle") 
  const statusAtUri = useRef<Status>("isIdle") 
  const statusAtMetadata = useRef<Status>("isIdle") 
  const [ data, setData ] = useState<LoyaltyProgram[] | undefined>() 
  const [ loyaltyPrograms, setLoyaltyPrograms ] = useState<LoyaltyProgram[]>() 

  console.log("address: ", address)
  console.log("statusAt chooseLoyaltyProgram: ", {
    statusAtAddresses: statusAtAddresses.current,
    statusAtUri: statusAtUri.current, 
    statusAtMetadata: statusAtMetadata.current
  })
  console.log("data: ", data)
  console.log("loyaltyPrograms: ", loyaltyPrograms)

  const fetchPrograms = () => {
    setStatus("isIdle")
    setData(undefined)
    setLoyaltyPrograms(undefined)
    getLoyaltyProgramAddresses()
  }

  const getLoyaltyProgramAddresses = async () => {
    statusAtAddresses.current = "isLoading"

    const loggedAdresses: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
        eventName: 'DeployedLoyaltyProgram', 
        args: {owner: address}, 
        fromBlock: 1n,
        toBlock: 16330050n
    });

    const loyaltyProgramAddresses = parseContractLogs(loggedAdresses)
    if (loyaltyProgramAddresses) statusAtAddresses.current = "isSuccess"
    setData(loyaltyProgramAddresses)
  }

  const getLoyaltyProgramsUris = async () => {
    statusAtUri.current = "isLoading" 

    let loyaltyProgram: LoyaltyProgram
    let loyaltyProgramsUpdated: LoyaltyProgram[] = []

    if (data) { 

      try {
        for await (loyaltyProgram of data) {

          const uri: unknown = await publicClient.readContract({
            address: loyaltyProgram.programAddress, 
            abi: loyaltyProgramAbi,
            functionName: 'uri',
            args: [0]
          })

          console.log("uri: ", uri)

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

          loyaltyProgramsUpdated.push({...loyaltyProgram, metadata: parseMetadata(fetchedMetadata), programOwner: address})
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
    // if (!data) { getLoyaltyProgramAddresses() } 
    if ( data && statusAtAddresses.current == "isSuccess" && statusAtUri.current == "isIdle" ) { 
      // statusAtUri.current = "isLoading"
      getLoyaltyProgramsUris() 
    } 
    if ( data && statusAtUri.current == "isSuccess" && statusAtMetadata.current == "isIdle" ) { 
      // statusAtMetadata.current = "isLoading"
      getLoyaltyProgramsMetaData() 
    }
  }, [ data  ])


  useEffect(() => {
    if (
      statusAtAddresses.current == "isSuccess" && 
      statusAtUri.current == "isSuccess" && 
      statusAtMetadata.current == "isSuccess"
      ) {
        setStatus("isSuccess")
        setLoyaltyPrograms(data)
      }
    if (
      statusAtAddresses.current == "isLoading" ||
      statusAtUri.current == "isLoading" || 
      statusAtMetadata.current == "isLoading"
      ) {
        setStatus("isLoading")
      }
  }, [ data ])

  return {status, loyaltyPrograms, fetchPrograms}
}