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
import { loyaltyProgramAbi, loyaltyTokenAbi, implementedLoyaltyTokenAbi } from "@/context/abi"
import { useEffect, useRef, useState } from "react"
import { parseContractLogs, parseEthAddress } from "../utils/parsers"
import { EthAddress, DeployedContractLog, LoyaltyToken } from "@/types"
import { parseUri, parseMetadata } from "../utils/parsers"
import { usePublicClient } from "wagmi"
import { Log } from "viem"
import { getContractEventsProps } from "@/types"
import { WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants"

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
    isLoading: true,
  })


  const getLogs = async (parameters: getContractEventsProps) => {
    loyaltyTokensData.current.isLoading = true
    // console.log("parameters at getLogs: ", parameters)

    try {
        const res: Log[] = await publicClient.getContractEvents(parameters); 
        // console.log("res: ", res)
        loyaltyTokensData.current.logs = parseContractLogs(res); 
        // console.log("loyaltyTokensData inside getlogs: ", loyaltyTokensData.current)
        return loyaltyTokensData; 
      } catch (error) {
        const result = {...loyaltyTokensData.current, isError: error };
        loyaltyTokensData.current = result; 
        return loyaltyTokensData; 
      }
  }

  const getMetadata = async(address: EthAddress) => {
    loyaltyTokensData.current.isLoading = true

    // console.log("getMetadata called")
    
    try {
      const uri: unknown = await publicClient.readContract({
        address: address, 
        abi: loyaltyTokenAbi,
        functionName: 'uri',
        args: [0]
      })

      // console.log("retrieved uri at loyaltyToken: ", uri) 

      const fetchedMetadata: unknown = await(
        await fetch(parseUri(uri))
        ).json()

      // console.log("fetchedMetadata at loyaltyToken, getMetadata: ", fetchedMetadata) 
      
      const result = {
        tokenAddress: address ? address : "0x0000000000000000000000000000", 
        uri: parseUri(uri), 
        metadata: parseMetadata(fetchedMetadata)
      }

      // console.log("result at loyaltyToken, getMetadata: ", result) 

      loyaltyTokensData.current.data.push(result) 

      // console.log("loyaltyTokensData at loyaltyToken, getMetadata: ", loyaltyTokensData.current) 

      return result

    } catch(error) {
      const result = { ...loyaltyTokensData.current, isError: error };
      loyaltyTokensData.current = result; 
      return loyaltyTokensData; 
    }
  }

  const getData = async () => {
    loyaltyTokensData.current = ({
      data: [],
      logs: [], 
      isError: null,
      isLoading: true,
    })

    const data = await getLogs(
      { 
        abi: loyaltyTokenAbi, 
        // abi: loyaltyProgramAbi, 
        eventName: 'DiscoverableLoyaltyToken', 
        args: {issuer: WHITELIST_TOKEN_ISSUERS_FOUNDRY}, 
        fromBlock: 1n,
        toBlock: 16330050n
      }
    )

    const tokenAddresses = loyaltyTokensData.current.logs.map(item => item.address)
    let tokenAddress: EthAddress; 

    try { 
      for await (tokenAddress of tokenAddresses) {
        // console.log("NB tokenAddress in LOOP BEFORE calling getMetadata @loyaltytokens: ", tokenAddress)
        const metaDatatoken = await getMetadata(tokenAddress)
        if (metaDatatoken) {loyaltyTokensData.current.isLoading = false}

        // console.log("metaDatatoken AFTER calling getMetadata @loyaltytokens: ", metaDatatoken)
      }
    } catch (error) {
      loyaltyTokensData.current.isError = error; 
      loyaltyTokensData.current.isLoading = false; 
    }
  } 

  useEffect(() => {
    // step 1: empty ref & set to loading. 
    if (address) { 
      getData()
    }
  }, [ , address]) // also has to update with change in chain id. -- implement later. 

  console.log("loyaltyTokensData.current: ", loyaltyTokensData.current)

  return loyaltyTokensData.current

}
