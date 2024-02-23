import {  LoyaltyToken, Status } from "@/types";
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

export const useLoyaltyGifts = () => {
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const publicClient = usePublicClient()

  const [ status, setStatus ] = useState<Status>("isIdle")
  const statusAtTokenAddress = useRef<Status>("isIdle") 
  const statusAtUri = useRef<Status>("isIdle") 
  const statusAtMetadata = useRef<Status>("isIdle") 
  const statusAtAvailableTokens = useRef<Status>("isIdle") 
  const [data, setData] = useState<LoyaltyToken[] | undefined>() 
  const [loyaltyGifts, setLoyaltyGifts] = useState<LoyaltyToken[] | undefined>() 

  console.log("status @useLoyaltyGifts: ", {
    statusAtTokenAddress: statusAtTokenAddress.current,
    statusAtUri: statusAtUri.current, 
    statusAtMetadata: statusAtMetadata.current,
    statusAtAvailableTokens: statusAtAvailableTokens.current
  })
  console.log("status @useLoyaltyGifts: ", status)
  console.log("data @useLoyaltyGifts: ", data)
  
  const fetchGifts = (requestedTokens?: LoyaltyToken[] ) => {
    setStatus("isIdle")
    setData(undefined)
    setLoyaltyGifts(undefined)
    if (requestedTokens) {
      setData(requestedTokens)
      statusAtTokenAddress.current = "isSuccess"
    } else {
      getLoyaltyTokenAddresses()
    }
  }

  const getLoyaltyTokenAddresses = async () => {
    statusAtTokenAddress.current = "isLoading"

    try { 
      const logs: Log[] = await publicClient.getContractEvents({
        abi: loyaltyGiftAbi, 
        eventName: 'LoyaltyGiftDeployed', 
        // args: {issuer: WHITELIST_TOKEN_ISSUERS_FOUNDRY}, // This should be an editable list inside the front end. improvement for later. 
        fromBlock: 5200000n
      });
      const loyaltyGifts = parseTokenContractLogs(logs)
      statusAtTokenAddress.current = "isSuccess"
      setData(loyaltyGifts)
    } catch (error) {
      statusAtTokenAddress.current = "isError"
      console.log(error)
    }
  }

  const getLoyaltyGiftsUris = async () => {
    statusAtUri.current = "isLoading"
    
    let item: LoyaltyToken
    let loyaltyGiftsUris: LoyaltyToken[] = []

    if (data) { 
      try {
        for await (item of data) {
          const uri: unknown = await publicClient.readContract({ 
            address: item.tokenAddress, 
            abi: loyaltyGiftAbi,
            functionName: 'uri',
            args: [item.tokenId]
          })
          const genericUri = parseUri(uri); 
          const specificUri = genericUri.replace("{id}", `000000000000000000000000000000000000000000000000000000000000000${item.tokenId}.json`)
          loyaltyGiftsUris.push({...item, uri: specificUri})
        }
        statusAtUri.current = "isSuccess"
        setData(loyaltyGiftsUris)
      } catch (error) {
        statusAtUri.current = "isError"
        console.log(error)
      }
    }
  }

  const getLoyaltyGiftsMetaData = async () => {
    statusAtMetadata.current = "isLoading"

    let item: LoyaltyToken
    let loyaltyGiftsMetadata: LoyaltyToken[] = []

    if (data) {
      try {
        for await (item of data) {
          if (item.uri) {
            const fetchedMetadata: unknown = await(
              await fetch(item.uri)
              ).json()
              loyaltyGiftsMetadata.push({...item, metadata: parseMetadata(fetchedMetadata)})
          }
        } 
        statusAtMetadata.current = "isSuccess"
        setData(loyaltyGiftsMetadata)
      } catch (error) {
        statusAtMetadata.current = "isError"
        console.log(error)
      }
    }
  }  

  const getAvailableVouchers = async () => {
    statusAtAvailableTokens.current = "isLoading" 

    let item: LoyaltyToken
    let loyaltyGiftsAvailableTokens: LoyaltyToken[] = []

    if (data && selectedLoyaltyProgram && selectedLoyaltyProgram.programAddress) { 
      try {
        for await (item of data) {
            const availableTokens: unknown = await publicClient.readContract({
              address: item.tokenAddress, 
              abi: loyaltyGiftAbi,
              functionName: 'balanceOf', 
              args: [parseEthAddress(selectedLoyaltyProgram?.programAddress), item.tokenId]
            })

            loyaltyGiftsAvailableTokens.push({...item, availableTokens: Number(parseBigInt(availableTokens))})
        } 
        statusAtAvailableTokens.current = "isSuccess"
        setData(loyaltyGiftsAvailableTokens)
      } catch (error) {
        statusAtAvailableTokens.current = "isError" 
        console.log(error)
      }
    } 
  }

  useEffect(() => {
    if ( 
      data && 
      statusAtTokenAddress.current == "isSuccess" && 
      statusAtUri.current == "isIdle" 
      ) { 
        getLoyaltyGiftsUris() 
    } 
    if ( 
      data && 
      statusAtUri.current == "isSuccess" && 
      statusAtMetadata.current == "isIdle" 
      ) {
        getLoyaltyGiftsMetaData() 
    }
    if ( 
      data && 
      statusAtMetadata.current == "isSuccess" && 
      statusAtAvailableTokens.current == "isIdle"
      ) {
        getAvailableVouchers() 
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
        setLoyaltyGifts(data)
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

  return {status, loyaltyGifts, fetchGifts}
}