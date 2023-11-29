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
import { useContractLogs } from "./useContractLogs"
// import { useTokenMetadata } from "./useTokenMetadata"
import { loyaltyProgramAbi } from "@/context/abi"
import { useEffect, useRef, useState } from "react"
import { parseContractLogs, parseEthAddress } from "../utils/parsers"
import { LoyaltyProgramMetadata, EthAddress, DeployedLoyaltyProgramLog } from "@/types"
import { parseUri, parseProgramMetadata } from "../utils/parsers"
import { usePublicClient } from "wagmi"
import { Log } from "viem"
import { getContractEventsProps } from "@/types"

export const useLoyaltyPrograms = () => {
  // const parameters: getContractEventsProps = {abi: loyaltyProgramAbi}
  let { address } = useAccount()
  const { progAddress } = useUrlProgramAddress()
  const publicClient = usePublicClient()
  const loyaltyPrograms = useRef<LoyaltyProgramMetadata[]>() 
  const status = useRef<"loading" | "error" | "success">() 
  status.current = "loading"
  const loggedIn = useRef<boolean>()
  loggedIn.current = true
  const loyaltyProgramsData = useRef<{data: LoyaltyProgramMetadata[]; logs: DeployedLoyaltyProgramLog[], indexProgram: number, isError: Error | null | unknown; isLoading: boolean}>({
    data: [],
    logs: [], 
    indexProgram: -1, 
    isError: null,
    isLoading: false,
  })
  // const result = { data: <Log[]>[], isError: null, isLoading: false };

  const getLogs = async (parameters: getContractEventsProps) => {

    try {
        const res: Log[] = await publicClient.getContractEvents(parameters); 
        loyaltyProgramsData.current.logs = parseContractLogs(res); 
        return loyaltyProgramsData; 
      } catch (error) {
        const result = { data: [], logs:[], indexProgram: -1, isError: error, isLoading: false };
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
        metadata: parseProgramMetadata(fetchedMetadata)
      }

      loyaltyProgramsData.current.data.push(result) 
      return result

    } catch(error) {
      const result = { data: [], logs:[], indexProgram: -1, isError: error, isLoading: false };
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
        console.log("NB tokenAddress in LOOP BEFORE calling getMetadata: ", tokenAddress)
        const metaDatatoken = await getMetadata(tokenAddress)

        console.log("metaDatatoken AFTER calling getMetadata: ", metaDatatoken)
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
    loyaltyProgramsData.current = {
      data: [],
      logs: [], 
      indexProgram: -1, 
      isError: null,
      isLoading: true
    }

    if (address) { 
      getData(parseEthAddress(address))
    }
  }, [address])

  loyaltyProgramsData.current.indexProgram = loyaltyProgramsData.current.logs.findIndex(
    item => item.address === progAddress
    ); 

  return loyaltyProgramsData.current

  // }, [address])

  // // checking address
  // if (address == undefined ) {
  //   address = "0x0000000000000000000000000000" // double check if this not ALSO makes that ALL contracts are loaded... YES: you get an error.  
  //   loggedIn.current = false
  //   status.current = "error"
  // }

  // // Step 1: retrieving contract addresses of loyalty programs owned by user. 
  // // NB: need to include Redux save & check here! -- Do I though? network load seems absolutely tiny. -- keep it simple... 
  // const { data } = useContractLogs(
  //   { 
  //     abi: loyaltyProgramAbi, 
  //     eventName: 'DeployedLoyaltyProgram', 
  //     args: {owner: address}, 
  //     fromBlock: 1n,
  //     toBlock: 16330050n
  //   }
  // )
  
  // const loyaltyProgramsDeployed = parseContractLogs(data)
  // const loyaltyProgramAddresses = loyaltyProgramsDeployed.map(program => program.address)
  // console.log("loyaltyProgramsADDRESSES from useContractLogs at useLoyaltyProgram: ", loyaltyProgramAddresses)

  // // step 2: retrieve metadata of users loyalty programs. 
  // const getData = async() => {
    
  //   let tokenAddress: EthAddress; 
  
  //   try { 
  //     for await (tokenAddress of loyaltyProgramAddresses) {
  //       console.log("NB tokenAddress in LOOP BEFORE calling getMetadata: ", tokenAddress)
  //       const metaDatatoken = await getMetadata(tokenAddress)

  //       console.log("metaDatatoken AFTER calling getMetadata: ", metaDatatoken)
  //     }
  //   } catch (error) {
  //     return ({
  //       tokenAddress: "0x00000000000000000000000000001",
  //       uri: null, 
  //       metadata: null, 
  //       status: "error"
  //     })
  //   }
  // }

  // useEffect(() => {
  //   getData()

  // }, [address])
  
  // // console.log("loyaltyPrograms METADATA from useTokenMetadata at useLoyaltyProgram: ", loyaltyPrograms)

  // let indexProgram: number = data.findIndex(item => item.address === progAddress); // naming of const's is still a bit ... iffy. progAddress should maybe be selectedLoyaltyProgram

  // loyaltyPrograms ? status.current = "success" : status.current = "error"  

  // return {
  //   loggedIn: loggedIn.current,
  //   loyaltyPrograms: loyaltyPrograms.current, 
  //   indexProgram: indexProgram, 
  //   status: status.current
  // }

}

