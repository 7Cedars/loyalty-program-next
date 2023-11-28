// Custom hook to keep track of metadata state . 
// input: array of contract addresses with uri function. 

// Output: 
// array of objects: TokenMetadata
// - name
// - Description 
// - Image
// - Attributes [] 

// Refresh at: 
// change in input + user address

import { useAccount } from "wagmi"
import { loyaltyProgramAbi } from "@/context/abi"
import { useRef, useEffect, useState } from "react"
import {  parseEthAddress, parseUri, parseProgramMetadata } from "../utils/parsers"
import { EthAddress, TokenMetadata, LoyaltyProgramMetadata } from "@/types"
import { usePublicClient } from "wagmi"

export const useTokenMetadata = (tokenAddresses: EthAddress[]) => {

  const publicClient = usePublicClient()
  const uriMetadataRef = useRef<Array<string>>() 
  const metadataRef = useRef<Array<TokenMetadata>>() 
  const programMetadata = useRef<Array<LoyaltyProgramMetadata>>() 
  const { address } = useAccount() 
  const [data, setData] = useState<string[]>([]) 

  const getUris = async(address: EthAddress) => {
    const uri = await publicClient.readContract({
      address: address, 
      abi: loyaltyProgramAbi,
      functionName: 'uri',
      args: [0]
    })
    return uri
  }

  console.log("tokenAddresses at useTokenMetadata: ", tokenAddresses)

  useEffect(() => {
    const collectUriMetadata = async() => {
      
      programMetadata.current = [{
        tokenAddress: "0x0000000000000000000000000002",
        uri: null, 
        metadata: null, 
        status: "loading"
      }]

      console.log("collectUriMetadata CALLED")

      try { 
        uriMetadataRef.current = []; 
        metadataRef.current = []; 
        const newData = []; 
        
        for await (address of tokenAddresses)  
          console.log("address in loop: ", address)
        
          // step 1: get & save Uris for metadata
          const data: unknown = await getUris(parseEthAddress(address)) 
          newData.push(parseUri(await getUris(parseEthAddress(address))))
          setData(newData) 
        
          )
          // console.log("LOOP CALLED. Metadata fetched:", newData)
          
          // const fetchedMetadata: unknown = await (await fetch(parseUri(data))).json()
          
          
          // metadataRef.current.push(parseProgramMetadata(fetchedMetadata)) 
        

        // console.log("uriMetadataRef.current: ", uriMetadataRef.current)

        // if (
        //   uriMetadataRef.current.length === tokenAddresses.length && 
        //   metadataRef.current.length === tokenAddresses.length
        //   ) {
        //     programMetadata.current = tokenAddresses.map((address, i) => {
        //       return ({
        //         tokenAddress: address,
        //         uri: uriMetadataRef.current ? uriMetadataRef.current[i] : null, 
        //         metadata: metadataRef.current ? metadataRef.current[i] : null, 
        //         status: "success"
        //       })
        //     })
        //   }
      } catch (error) {
        return ({
          tokenAddress: "0x00000000000000000000000000001",
          uri: null, 
          metadata: null, 
          status: "error"
        })
      }
    }

    if (uriMetadataRef.current == undefined || uriMetadataRef.current.length == 0 ) {
      collectUriMetadata() 
    } 

  }, [tokenAddresses, address])

  return programMetadata.current

}