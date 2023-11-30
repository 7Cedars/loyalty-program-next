// Custom hook. 
// input: loyaltyProgramAddress. 

// Output: 
// array of objects: LoyaltyTokens active in loyaltyProgram. Each object consists of: 
// - LoyaltyToken address
// - LoyaltyToken name
// - Description 
// - Image
// - Attributes 
//   - Redeem for 
//   - Points
//   - Additional requirements

// Refresh at: 
// change in loyaltyProgramAddress. 
// change in chain id. 

import { useAccount } from "wagmi"
import { useUrlProgramAddress } from "./useUrl"
import { loyaltyProgramAbi, loyaltyTokenAbi } from "@/context/abi"
import { useEffect, useRef, useState } from "react"
import { parseContractLogs, parseEthAddress } from "../utils/parsers"
import { EthAddress, DeployedContractLog, LoyaltyToken } from "@/types"
import { parseUri, parseProgramMetadata } from "../utils/parsers"
import { usePublicClient } from "wagmi"
import { Log } from "viem"
import { getContractEventsProps } from "@/types"

export const useLoyaltyTokens = () => {
  let { address } = useAccount()
  const publicClient = usePublicClient()
  const status = useRef<"loading" | "error" | "success">() 
  status.current = "loading"
  const loggedIn = useRef<boolean>()
  loggedIn.current = true
  const loyaltyTokensData = useRef<{data: LoyaltyToken[]; logs: DeployedContractLog[], isError: Error | null | unknown; isLoading: boolean}>({
    data: [],
    logs: [], 
    isError: null,
    isLoading: false,
  })

  const getLogs = async (parameters: getContractEventsProps) => {

    try {
        const res: Log[] = await publicClient.getContractEvents(parameters); 
        loyaltyTokensData.current.logs = parseContractLogs(res); 
        return loyaltyTokensData; 
      } catch (error) {
        const result = { data: [], logs:[], isError: error, isLoading: false };
        loyaltyTokensData.current = result; 
        return loyaltyTokensData; 
      }
  }

  const getMetadata = async(address: EthAddress) => {
    
    try {
      const uri: unknown = await publicClient.readContract({
        address: address, 
        abi: loyaltyTokenAbi,
        functionName: 'uri',
        args: [0]
      })
      
      const fetchedMetadata: unknown = await(
        await fetch(parseUri(uri))
        ).json()
      const result = {
        tokenAddress: address ? address : "0x0000000000000000000000000000", 
        uri: parseUri(uri), 
        metadata: parseProgramMetadata(fetchedMetadata)
      }

      loyaltyTokensData.current.data.push(result) 
      return result

    } catch(error) {
      const result = { data: [], logs:[], isError: error, isLoading: false };
      loyaltyTokensData.current = result; 
      return loyaltyTokensData; 
    }
  }

  const getData = async () => {

    const loyaltyTokensData = await getLogs(
      { 
        abi: loyaltyTokenAbi, 
        eventName: 'URI', 
        // standard account 4 from Anvil chain -- for me this is the one that deploys the contracts.   
        // note that this can be used to whitelist sources of loyalty token addresses.  
        args: {issuer: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"}, 
        fromBlock: 1n,
        toBlock: 16330050n
      }
    )

    console.log("loyaltyTokensData: ", loyaltyTokensData)

    const tokenAddresses = loyaltyTokensData.current.logs.map(item => item.address)
    let tokenAddress: EthAddress; 

    try { 
      for await (tokenAddress of tokenAddresses) {
        // console.log("NB tokenAddress in LOOP BEFORE calling getMetadata: ", tokenAddress)
        const metaDatatoken = await getMetadata(tokenAddress)

        // console.log("metaDatatoken AFTER calling getMetadata: ", metaDatatoken)
      }
    } catch (error) {
      return ({
        tokenAddress: "0x0000000000000000000000000000",
        uri: null, 
        metadata: null, 
        status: "error"
      })
    }
  } 

  useEffect(() => {
    // step 1: empty ref & set to loading. 
    if (address) { 
      getData()
    }
  }, [ , address]) // also has to update with change in chain id. -- implement later. 

  return loyaltyTokensData.current

}
