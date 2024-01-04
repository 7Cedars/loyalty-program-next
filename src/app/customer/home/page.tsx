
"use client"; 

// Will do clean up later. 
import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { BASE_URI } from "@/context/constants";
import { resetLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { useAccount } from 'wagmi'
import { LoyaltyCard, LoyaltyProgram } from "@/types";
import { TitleText } from "../../ui/StandardisedFonts";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUrlProgramAddress } from '../../hooks/useUrl';
import { usePublicClient } from 'wagmi';
import { loyaltyProgramAbi } from '@/context/abi';
import { Log, Transaction } from 'viem';
import { parseContractLogs, parseUri, parseMetadata, parseEthAddress, parseTransferSingleLogs } from '../../utils/parsers';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { selectLoyaltyCard, resetLoyaltyCard } from '@/redux/reducers/loyaltyCardReducer';
import RequestCard from "./RequestCard";
import SelectLoyaltyCard from "./SelectLoyaltyCard";
import RequestPoints from "./RequestPoints";

export default function Page()  {
  const { address } = useAccount() 
  const publicClient = usePublicClient(); 
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const [ loyaltyCards, setLoyaltyCards ] = useState<LoyaltyCard[] | undefined>() 
  const dispatch = useDispatch() 

  console.log("address at home: ", address)
  console.log("loyaltyCards at home: ", loyaltyCards)

  const getLoyaltyCardIds = async () => {
    console.log("getLoyaltyCardIds called, address: ", address)

    const transferSingleData: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi,
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle',
      args: {to: address}, 
      fromBlock: 1n,
      toBlock: 16330050n
    });
    
    const transferredTokens = parseTransferSingleLogs(transferSingleData)
    const loyaltyCardData = transferredTokens.filter(token => token.ids[0] != 0n)

    if (loyaltyCardData && progAddress) { 
      const data: LoyaltyCard[] = loyaltyCardData.map(item => { return ({
        cardId: Number(item.ids[0]), 
        loyaltyProgramAddress: parseEthAddress(progAddress)
      })})
      setLoyaltyCards(data)
    } 
    console.log("loyaltyCards: ", loyaltyCards)
  }

  const getLoyaltyCardAddresses = async () => {
    console.log("getLoyaltyCardAddresses called")

    let loyaltyCard: LoyaltyCard
    let loyaltyCardsUpdated: LoyaltyCard[] = []

    if (loyaltyCards && loyaltyCards.length > 0 ) { 
      try {
        for await (loyaltyCard of loyaltyCards) {

            const cardAddress: unknown = await publicClient.readContract({
              address: parseEthAddress(progAddress), 
              abi: loyaltyProgramAbi,
              functionName: 'getTokenBoundAddress', 
              args: [loyaltyCard.cardId]
            })

            const isOwned: unknown = await publicClient.readContract({
              address: parseEthAddress(progAddress), 
              abi: loyaltyProgramAbi,
              functionName: 'balanceOf', 
              args: [address, loyaltyCard.cardId]
            })

            isOwned ? loyaltyCardsUpdated.push({...loyaltyCard, cardAddress: parseEthAddress(cardAddress)}) : null 

          }
          setLoyaltyCards(loyaltyCardsUpdated)

        } catch (error) {
          console.log(error)
      }
    }
  }

  useEffect(() => {

    if (!loyaltyCards) { getLoyaltyCardIds() } // check when address has no cards what happens..  
    if (
      loyaltyCards && 
      loyaltyCards.findIndex(loyaltyCard => loyaltyCard.cardAddress) === -1 
      ) { 
        getLoyaltyCardAddresses() 
      } 
  }, [ , loyaltyCards])

  useEffect(() => {
    if (loyaltyCards) { setLoyaltyCards(undefined) } 
  }, [, address])

  useEffect(() => {
    if (
      loyaltyCards && 
      loyaltyCards.length == 1 
      ) { dispatch(selectLoyaltyCard(loyaltyCards[0])) } 
  }, [, loyaltyCards])

  return (
    <div className="grid grid-cols-1 h-full content-between pt-2">
      { 
      selectedLoyaltyCard ? 
        <RequestPoints /> 
      : 
      loyaltyCards && loyaltyCards.length == 0 ? 
        <RequestCard /> 
      : 
      loyaltyCards && loyaltyCards.length > 1 && !selectedLoyaltyCard ? 
        <SelectLoyaltyCard loyaltyCards = {loyaltyCards}/> 
      :
      <div> Something went wrong, no loyalty card selected. </div> 
      }   
    </div>  
    )
  }
