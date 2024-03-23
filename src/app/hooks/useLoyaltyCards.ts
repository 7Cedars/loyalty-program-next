import { EthAddress, LoyaltyCard, Status } from "@/types";
import { useEffect, useRef, useState } from "react";
import { loyaltyProgramAbi } from "@/context/abi";
import { usePublicClient } from 'wagmi'
import { 
  parseBigInt,
  parseEthAddress,
  parseTransferSingleLogs,
} from "@/app/utils/parsers";
import { Log } from "viem"

type FetchCardsProps = {
  userAddress: EthAddress;
  programAddress: EthAddress; 
}

export const useLoyaltyCards = () => {
  const publicClient = usePublicClient(); 
  const [ status, setStatus ] = useState<Status>("isIdle")
  const statusAtIds = useRef<Status>("isIdle") 
  const statusAtCheckOwned = useRef<Status>("isIdle") 
  const statusAtAddress = useRef<Status>("isIdle") 
  const [ data, setData ] = useState<LoyaltyCard[] | undefined>() 
  const [ loyaltyCards, setLoyaltyCards ] = useState<LoyaltyCard[]>() 

  console.log("status @useLoyaltyCards: ", {
    statusAtIds: statusAtIds.current,
    statusAtCheckOwned: statusAtCheckOwned.current, 
    statusAtAddress: statusAtAddress.current
  })
  console.log("data @useLoyaltyCards: ", data)
  console.log("loyaltyCards: ", loyaltyCards)

  const fetchCards = ({userAddress, programAddress}: FetchCardsProps) => {
    console.log("FETCH CARDS CALLED @useLoyaltyCards")
    setStatus("isIdle")
    setData(undefined)
    setLoyaltyCards(undefined)
    getLoyaltyCardIds(userAddress, programAddress)
  }

  const getLoyaltyCardIds = async (userAddress: EthAddress, programAddress: EthAddress) => {
    statusAtIds.current = "isLoading"

    if (publicClient)
    try {
      const transferSingleData: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: programAddress, 
        eventName: 'TransferSingle', 
        args: {to: userAddress}, 
        fromBlock: 25888893n
      });
      const transferredTokens = parseTransferSingleLogs(transferSingleData)
      const loyaltyCardData = transferredTokens.filter(token => token.ids[0] != 0n)
  
      if (loyaltyCardData) { 
        const tempData: LoyaltyCard[] = loyaltyCardData.map(item => { return ({
          cardId: Number(item.ids[0]), 
          loyaltyProgramAddress: parseEthAddress(programAddress),
          userAddress: parseEthAddress(userAddress)
        })})
        statusAtIds.current = "isSuccess"
        setData(tempData)
      }
    } catch (error) {
      statusAtIds.current = "isError" 
      console.log(error)
    }    
  }

  const checkLoyaltyCardOwned = async () => {
    statusAtCheckOwned.current = "isLoading"

    let loyaltyCard: LoyaltyCard
    let loyaltyCardsUpdated: LoyaltyCard[] = []

    if (data && publicClient) { 
      try {
        for await (loyaltyCard of data) {
        
          const isOwned: unknown = await publicClient.readContract({
            address: parseEthAddress(loyaltyCard.loyaltyProgramAddress), 
            abi: loyaltyProgramAbi,
            functionName: 'balanceOf', 
            args: [loyaltyCard.userAddress, loyaltyCard.cardId]
          })
          isOwned ? loyaltyCardsUpdated.push(loyaltyCard) : null 
        }
      statusAtCheckOwned.current = "isSuccess" 
      setData(loyaltyCardsUpdated) 
      } catch (error) {
        statusAtCheckOwned.current = "isError" 
        console.log(error)
      }
    }
  }

  const getLoyaltyCardAddress = async () => {
    statusAtAddress.current = "isLoading"

    let loyaltyCard: LoyaltyCard
    let loyaltyCardsUpdated: LoyaltyCard[] = []

    if (data && publicClient) { 
      try {
        for await (loyaltyCard of data) {
        
        const cardAddress: unknown = await publicClient.readContract({
          address: parseEthAddress(loyaltyCard.loyaltyProgramAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'getTokenBoundAddress', 
          args: [loyaltyCard.cardId]
        })

        loyaltyCardsUpdated.push({...loyaltyCard, cardAddress: `${parseEthAddress(cardAddress)}`})
      }
      statusAtAddress.current = "isSuccess" 
      setData(loyaltyCardsUpdated) 
      } catch (error) {
        statusAtAddress.current = "isError" 
        console.log(error)
      }
    }
  }



  useEffect(() => {
    if ( 
      data && 
      statusAtIds.current == "isSuccess" && 
      statusAtCheckOwned.current == "isIdle" 
      ) checkLoyaltyCardOwned() 
    if ( 
      data && 
      statusAtCheckOwned.current == "isSuccess" && 
      statusAtAddress.current == "isIdle" 
      ) getLoyaltyCardAddress() 
  }, [ data  ])

  useEffect(() => {
    if (
      statusAtIds.current == "isLoading" ||
      statusAtCheckOwned.current == "isLoading" || 
      statusAtAddress.current == "isLoading" 
      ) {
        setStatus("isLoading")
      }
    if (
      statusAtIds.current == "isSuccess" && 
      statusAtCheckOwned.current == "isSuccess" && 
      statusAtAddress.current == "isSuccess" 
      ) {
        setStatus("isSuccess")
        setLoyaltyCards(data)
      }
  }, [ data ])

  return {status, loyaltyCards, fetchCards}
}