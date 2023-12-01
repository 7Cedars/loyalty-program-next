// NB: this should incorporate the useLoginAndProgram hook. 

// Custom hook. 
// input: none. 

// Output: 
// array of objects: LoyaltyPrograms owned by logged in user. Each object consists of: 
// - LoyaltyProgram address
// - LoyaltyProgram name
// - Description 
// - Image
// - Attributes 
//   - vendor name
//   - vendor address
//   - vendor phone
// - the index of selected program (from Url) among owned loyaltyProgram. -1 indicates that selected program is NOT owned by user. 

// Refresh at: 
// change in address. 
// change in chain id. 

import { useAccount } from "wagmi"
import { useUrlProgramAddress } from "./useUrl"
import { loyaltyProgramAbi } from "@/context/abi"
import { useEffect, useRef } from "react"
import { parseContractLogs, parseEthAddress } from "../utils/parsers"
import { LoyaltyProgram, EthAddress, DeployedContractLog } from "@/types"
import { parseUri, parseMetadata } from "../utils/parsers"
import { usePublicClient } from "wagmi"
import { Log } from "viem"
import { getContractEventsProps } from "@/types"

export const useLoyaltyPrograms = () => {
  // const parameters: getContractEventsProps = {abi: loyaltyProgramAbi}
  let { address } = useAccount()
  const publicClient = usePublicClient()
  const status = useRef<"loading" | "error" | "success">() 
  status.current = "loading"
  const loggedIn = useRef<boolean>()
  loggedIn.current = true
  const loyaltyProgramsData = useRef<{data: LoyaltyProgram[]; logs: DeployedContractLog[], isError: Error | null | unknown; isLoading: boolean}>({
    data: [],
    logs: [], 
    isError: null,
    isLoading: false,
  })

  const getLogs = async (parameters: getContractEventsProps) => {
    try {
        const res: Log[] = await publicClient.getContractEvents(parameters); 
        loyaltyProgramsData.current.logs = parseContractLogs(res); 
        return loyaltyProgramsData; 
      } catch (error) {
        const result = { data: [], logs:[], isError: error, isLoading: false };
        loyaltyProgramsData.current = result; 
        return loyaltyProgramsData; 
      }
  }

  const getMetadata = async(address: EthAddress) => {
    try {
      const uri: unknown = await publicClient.readContract({
        address: address, 
        abi: loyaltyProgramAbi,
        functionName: 'uri',
        args: [0]
      })
      
      const fetchedMetadata: unknown = await(
        await fetch(parseUri(uri))
        ).json()
      const result = {
        tokenAddress: address ? address : "0x0000000000000000000000000000", 
        uri: parseUri(uri), 
        metadata: parseMetadata(fetchedMetadata)
      }

      loyaltyProgramsData.current.data.push(result) 
      return result

    } catch(error) {
      const result = { data: [], logs:[], isError: error, isLoading: false };
      loyaltyProgramsData.current = result; 
      return loyaltyProgramsData; 
    }
  }

  const getData = async (ownerAddress: EthAddress) => {
    const loyaltyProgramsData = await getLogs(
      { 
        abi: loyaltyProgramAbi, 
        eventName: 'DeployedLoyaltyProgram', 
        args: {owner: ownerAddress}, 
        fromBlock: 1n,
        toBlock: 16330050n
      }
    )

    const tokenAddresses = loyaltyProgramsData.current.logs.map(item => item.address)
    let tokenAddress: EthAddress; 

    try { 
      for await (tokenAddress of tokenAddresses) {
        const metaDatatoken = await getMetadata(tokenAddress)
        // console.log("metaDatatoken at useLoyaltyProgram: ", metaDatatoken)
      }
    } catch (error) {
      loyaltyProgramsData.current.isError = error; 
      loyaltyProgramsData.current.isLoading = false; 
    }
  } 

  useEffect(() => {
    // step 1: empty ref & set to loading. 
    if (address) { 
      getData(parseEthAddress(address))
    }
  }, [ , address]) // also has to update with change in chain id. -- implement later. 

  return loyaltyProgramsData.current

}

