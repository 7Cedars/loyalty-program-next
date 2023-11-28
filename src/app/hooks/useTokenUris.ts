// Custom hook to keep track of metadata state . 
// input: array of contract addresses with uri function. 

// Output: 
// array of objects: TokenMetadata
// - name
// - Description 
// - Image
// - Attributes [] 

// Refresh at: 
// change in input

import { useAccount } from "wagmi"
import { useLoyaltyProgramAddress } from "./useUrl"
import { useContractLogs } from "./useContractLogs"
import { loyaltyProgramAbi } from "@/context/abi"
import { useRef, useEffect } from "react"
import { parseContractLogs, parseEthAddress, parseUri, parseProgramMetadata } from "../utils/parsers"
import { EthAddress, TokenMetadata } from "@/types"
import { usePublicClient } from "wagmi"


export const useTokenUris = (tokenAddresses: EthAddress[]) => {

  const publicClient = usePublicClient()
  const uris = useRef<Array<string>>() 
  const metadataPrograms = useRef<Array<TokenMetadata>>() 
  const { address } = useAccount() 

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
      metadataPrograms.current = [];  
      for await (const address of tokenAddresses) {
        // step 1: get & save Uris for metadata
        const data: unknown = await getUris(parseEthAddress(address)) 
        const uriMetadata = parseUri(data)
        // step 2: get & save metadata
        const fetchedMetadata: unknown = await (await fetch(uriMetadata)).json()
        const metadata: TokenMetadata = parseProgramMetadata(fetchedMetadata) 

        console.log("fetchedMetadata at useTokenUri hook: ", fetchedMetadata)
        if (uriMetadata && metadata) {
          uris.current.push(uriMetadata) 
          metadataPrograms.current.push(metadata)
        }
      }
    }

  useEffect(() => {
    collectUriMetadata() 
  }, [address, tokenAddresses])

  return {
    uris: uris, 
    metadataPrograms: metadataPrograms
  }

}