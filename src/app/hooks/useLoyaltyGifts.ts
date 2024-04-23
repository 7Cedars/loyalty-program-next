import {  EthAddress, LoyaltyGift, Status } from "@/types";
import { readContracts } from '@wagmi/core'
import { config } from '../../../config'
import { useEffect, useRef, useState } from "react";
import { loyaltyGiftAbi } from "@/context/abi";
import { Log } from "viem"
import { useAccount, usePublicClient } from 'wagmi'
import { 
  parseUri, 
  parseMetadata, 
  parseTokenContractLogs,
  parseEthAddress,
  parseBigInt,
} from "@/app/utils/parsers";
import { SUPPORTED_CHAINS, WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants"; // this should be possible to set at website.  
import { useAppSelector } from "@/redux/hooks";

export const useLoyaltyGifts = () => {
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const publicClient = usePublicClient()
  const {chain} = useAccount()  

  const [ status, setStatus ] = useState<Status>("isIdle")
  const statusAtgiftAddress = useRef<Status>("isIdle") 
  const statusAtUri = useRef<Status>("isIdle") 
  const statusAtMetadata = useRef<Status>("isIdle") 
  const statusAtGetAdditionalInfo = useRef<Status>("isIdle")
  const statusAtAvailableVouchers = useRef<Status>("isIdle") 
  const [data, setData] = useState<LoyaltyGift[] | undefined>() 
  const [loyaltyGifts, setLoyaltyGifts] = useState<LoyaltyGift[] | undefined>() 
  const [loyaltyGiftContracts, setLoyaltyGiftContracts] = useState<EthAddress[] | undefined>() 

  console.log("loyaltyGifts: ", loyaltyGifts)
  
  const fetchGifts = (requestedGifts?: LoyaltyGift[] ) => {
    setStatus("isIdle")
    setData(undefined)
    setLoyaltyGifts(undefined)
    getLoyaltyGiftAddresses(requestedGifts)
  }

  const updateAvailableVouchers = () => {
    setStatus("isIdle")
    statusAtAvailableVouchers.current = "isIdle"
    getAvailableVouchers() 
  }

  const getLoyaltyGiftAddresses = async (requestedGifts?: LoyaltyGift[]) => {
    statusAtgiftAddress.current = "isLoading"

    if (requestedGifts) { 
      statusAtgiftAddress.current = "isSuccess"
      setData(requestedGifts)
    } else { 
      if (publicClient && chain)
      try { 
        const selectedChain: any = SUPPORTED_CHAINS.find(block => block.chainId === chain.id)
        const logs: Log[] = await publicClient.getContractEvents({
          abi: loyaltyGiftAbi, 
          eventName: 'LoyaltyGiftDeployed', 
          // args: {issuer: WHITELIST_TOKEN_ISSUERS_FOUNDRY}, // This should be an editable list inside the front end. improvement for later. 
          fromBlock: selectedChain?.fromBlock
        });
        const loyaltyGifts = parseTokenContractLogs(logs)
        statusAtgiftAddress.current = "isSuccess"
        setData(loyaltyGifts)
      } catch (error) {
        statusAtgiftAddress.current = "isError"
        console.log(error)
      }
    }
  }

  const getLoyaltyGiftsUris = async () => {
    statusAtUri.current = "isLoading"
    
    let item: LoyaltyGift
    let loyaltyGiftsUris: LoyaltyGift[] = []

    if (data && publicClient) { 
      try {
        for await (item of data) {
          const uri: unknown = await publicClient.readContract({ 
            address: item.giftAddress, 
            abi: loyaltyGiftAbi,
            functionName: 'uri',
            args: [item.giftId]
          })
          const genericUri = parseUri(uri); 
          const specificUri = genericUri.replace("{id}", `000000000000000000000000000000000000000000000000000000000000000${item.giftId}.json`)
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

    let item: LoyaltyGift
    let loyaltyGiftsMetadata: LoyaltyGift[] = []

    if (data && publicClient) {
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

  const getAdditionalInfo = async () => {
    statusAtGetAdditionalInfo.current = "isLoading" 

    let item: LoyaltyGift
    let loyaltyGiftAdditionalInfo: LoyaltyGift[] = []

    if (data && selectedLoyaltyProgram && selectedLoyaltyProgram.programAddress && publicClient) { 
      try {
        for await (item of data) {

          const giftContract = {
            address: item.giftAddress,
            abi: loyaltyGiftAbi,
          } as const

          const data = await readContracts(config, {
            contracts: [
              {
                ...giftContract, 
                functionName: 'getIsClaimable', 
                args: [item.giftId]
              }, 
              {
                ...giftContract, 
                functionName: 'getCost', 
                args: [item.giftId]
              }, 
              {
                ...giftContract, 
                functionName: 'getHasAdditionalRequirements', 
                args: [item.giftId]
              }, 
              {
              ...giftContract, 
                functionName: 'getIsVoucher', 
                args: [item.giftId]
              },
            ], 
          })

          console.log("data @getAdditionalInfo: ", data)

            if (
              data[0].status == "success" && 
              data[1].status == "success" && 
              data[2].status == "success" && 
              data[3].status == "success"
            )
              loyaltyGiftAdditionalInfo.push({
                ...item, 
                isClaimable: parseBigInt(data[0].result), 
                cost: parseBigInt(data[1].result), 
                hasAdditionalRequirements: parseBigInt(data[2].result), 
                isVoucher: parseBigInt(data[3].result)
              })
        } 
        statusAtGetAdditionalInfo.current = "isSuccess"
        setData(loyaltyGiftAdditionalInfo)
      } catch (error) {
        statusAtGetAdditionalInfo.current = "isError" 
        console.log(error)
      }
    } 

    statusAtGetAdditionalInfo.current = "isSuccess"
  }

  const getAvailableVouchers = async () => {
    statusAtAvailableVouchers.current = "isLoading" 

    let item: LoyaltyGift
    let loyaltyGiftsAvailableVouchers: LoyaltyGift[] = []

    if (data && selectedLoyaltyProgram && selectedLoyaltyProgram.programAddress && publicClient) { 
      try {
        for await (item of data) {
            const availableVouchers: unknown = await publicClient.readContract({
              address: item.giftAddress, 
              abi: loyaltyGiftAbi,
              functionName: 'balanceOf', 
              args: [parseEthAddress(selectedLoyaltyProgram?.programOwner), item.giftId]
            })

            loyaltyGiftsAvailableVouchers.push({...item, availableVouchers: Number(parseBigInt(availableVouchers))})
        } 
        statusAtAvailableVouchers.current = "isSuccess"
        setData(loyaltyGiftsAvailableVouchers)
      } catch (error) {
        statusAtAvailableVouchers.current = "isError" 
        console.log(error)
      }
    } 
  }

  useEffect(() => {
    if ( 
      data && 
      statusAtgiftAddress.current == "isSuccess" && 
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
      statusAtGetAdditionalInfo.current == "isIdle"
      ) {
        getAdditionalInfo() 
    } 
    if ( 
      data && 
      statusAtGetAdditionalInfo.current == "isSuccess" && 
      statusAtAvailableVouchers.current == "isIdle"
      ) {
        getAvailableVouchers() 
    } 
  }, [ data  ])

  useEffect(() => {
    if (
      statusAtgiftAddress.current == "isSuccess" && 
      statusAtUri.current == "isSuccess" && 
      statusAtMetadata.current == "isSuccess" && 
      statusAtAvailableVouchers.current == "isSuccess" 
      ) {
        setStatus("isSuccess")
        setLoyaltyGifts(data)

        const dataContracts = Array.from(new Set(data?.map(item => item.giftAddress))) 
        setLoyaltyGiftContracts(dataContracts)

      }
    if (
      statusAtgiftAddress.current == "isLoading" ||
      statusAtUri.current == "isLoading" || 
      statusAtMetadata.current == "isLoading" || 
      statusAtAvailableVouchers.current == "isLoading" 
      ) {
        setStatus("isLoading")
      }
  }, [ data ])

  return {status, loyaltyGifts, loyaltyGiftContracts, fetchGifts, updateAvailableVouchers}
}