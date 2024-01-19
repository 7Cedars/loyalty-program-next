// Custom hook loading all available Loyalty token included in a whitelist.. 
// Note that the structure of this hook is a good standard way of creating hooks with
// multiple (sequenced) async calls. 

import { LoyaltyToken } from "@/types";
import { useEffect, useRef, useState } from "react";
import { loyaltyGiftAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient } from 'wagmi'
import { 
  parseUri, 
  parseMetadata, 
  parseTokenContractLogs,
  parseEthAddress,
  parseBigInt,
} from "@/app/utils/parsers";
import { WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants"; // this should be possible to set at website.  
import { useAppSelector } from "@/redux/hooks";
import { useUrlProgramAddress } from "./useUrl";

type Status = "isIdle" | "isLoading" | "isError" | "isSuccess" 

export const useLoyaltyTokens = () => {
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { progAddress } = useUrlProgramAddress() 
  const publicClient = usePublicClient()

  const [ status, setStatus ] = useState<Status>("isIdle")
  const statusAtTokenAddress = useRef<Status>("isIdle") 
  const statusAtUri = useRef<Status>("isIdle") 
  const statusAtMetadata = useRef<Status>("isIdle") 
  const statusAtAvailableTokens = useRef<Status>("isIdle") 
  const [data, setData] = useState<LoyaltyToken[] | undefined>() 
  const [loyaltyTokens, setLoyaltyTokens] = useState<LoyaltyToken[] | undefined>() 

  console.log("statusAt useLoyaltyTokens: ", {
    statusAtTokenAddress: statusAtTokenAddress.current,
    statusAtUri: statusAtUri.current, 
    statusAtMetadata: statusAtMetadata.current,
    statusAtAvailableTokens: statusAtAvailableTokens.current
  })
  console.log("status useLoyaltyTokens: ", status)
  console.log("data: ", data)
  
  const fetchTokens = () => {
    setStatus("isLoading")
    setData(undefined)
    getLoyaltyTokenAddresses()
  }

  const getLoyaltyTokenAddresses = async () => {
    statusAtTokenAddress.current = "isLoading"

    const loggedAddresses: Log[] = await publicClient.getContractEvents({
      abi: loyaltyGiftAbi, 
      eventName: 'DiscoverableLoyaltyGift', 
      // args: {issuer: WHITELIST_TOKEN_ISSUERS_FOUNDRY}, 
      fromBlock: 1n,
      toBlock: 16330050n
    });
    
    const loyaltyTokenAddresses = parseTokenContractLogs(loggedAddresses)
    if (loyaltyTokenAddresses) statusAtTokenAddress.current = "isSuccess"
    setData(loyaltyTokenAddresses)
  }

  const getLoyaltyTokensUris = async () => {
    let item: LoyaltyToken
    let loyaltyTokensUris: LoyaltyToken[] = []

    if (data) { 

      for await (item of data) {
        try {
          const uri: unknown = await publicClient.readContract({ 
            address: item.tokenAddress, 
            abi: loyaltyGiftAbi,
            functionName: 'uri',
            args: [item.tokenId]
          })
          const genericUri = parseUri(uri); 
          const specificUri = genericUri.replace("{id}", `000000000000000000000000000000000000000000000000000000000000000${item.tokenId}.json`)

          loyaltyTokensUris.push({...item, uri: specificUri})
        
        } catch (error) {
          console.log(error)
        }
      }
      setData(loyaltyTokensUris)
      if (loyaltyTokensUris) statusAtUri.current = "isSuccess"
    }
  }

  const getLoyaltyTokensMetaData = async () => {
    let item: LoyaltyToken
    let loyaltyTokensMetadata: LoyaltyToken[] = []

    if (data) { 
      for await (item of data) {
        try {
          if (item.uri) {
            const fetchedMetadata: unknown = await(
              await fetch(item.uri)
              ).json()
              loyaltyTokensMetadata.push({...item, metadata: parseMetadata(fetchedMetadata)})
          }
        } catch (error) {
          console.log(error)
        }
      }
      setData(loyaltyTokensMetadata)
      if (loyaltyTokensMetadata.length == data.length) statusAtMetadata.current = "isSuccess"
    } 
  }   

  const getAvailableTokens = async () => {
    let item: LoyaltyToken
    let loyaltyTokensAvailableTokens: LoyaltyToken[] = []

    if (data && selectedLoyaltyProgram && selectedLoyaltyProgram.programAddress) { 
        for await (item of data) {
          try {

            const availableTokens: unknown = await publicClient.readContract({
              address: item.tokenAddress, 
              abi: loyaltyGiftAbi,
              functionName: 'balanceOf', 
              args: [parseEthAddress(progAddress), item.tokenId]
            })

            loyaltyTokensAvailableTokens.push({...item, availableTokens: Number(parseBigInt(availableTokens))})
        } catch (error) {
          console.log(error)
        }
      } 
      setData(loyaltyTokensAvailableTokens)
      if (loyaltyTokensAvailableTokens.length == data.length) statusAtAvailableTokens.current = "isSuccess"
    }
  }

  if (!data) { getLoyaltyTokenAddresses() }
  useEffect(() => {
    if ( data && statusAtTokenAddress.current == "isSuccess" && statusAtUri.current == "isIdle" ) { 
      statusAtUri.current = "isLoading"
      getLoyaltyTokensUris() 
    } 
    if ( data && statusAtUri.current == "isSuccess" && statusAtMetadata.current == "isIdle" ) { 
      statusAtMetadata.current = "isLoading"
      getLoyaltyTokensMetaData() 
    }
    if ( data && statusAtMetadata.current == "isSuccess" && statusAtAvailableTokens.current == "isIdle") { 
      statusAtAvailableTokens.current = "isLoading"
      getAvailableTokens() 
    } 
  }, [ data  ])

  useEffect(() => {
    if (
      statusAtTokenAddress.current == "isSuccess" && 
      statusAtUri.current == "isSuccess" && 
      statusAtMetadata.current == "isSuccess" && 
      statusAtAvailableTokens.current == "isSuccess" 
      ) {
        setStatus("isSuccess")
        setLoyaltyTokens(data)
      }
    if (
      statusAtTokenAddress.current == "isLoading" ||
      statusAtUri.current == "isLoading" || 
      statusAtMetadata.current == "isLoading" || 
      statusAtAvailableTokens.current == "isLoading" 
      ) {
        setStatus("isLoading")
      }
  }, [ data ])

  return {status, loyaltyTokens, fetchTokens}
}