
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
import { Log } from 'viem';
import { parseContractLogs, parseUri, parseMetadata, parseEthAddress, parseTransferSingleLogs } from '../../utils/parsers';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { selectLoyaltyCard, resetLoyaltyCard } from '@/redux/reducers/loyaltyCardReducer';
import RequestCard from "./RequestCard";
import SelectLoyaltyCard from "./SelectLoyaltyCard";

export default function Page()  {
  const { address } = useAccount() 
  const publicClient = usePublicClient(); 
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const [ loyaltyCards, setLoyaltyCards ] = useState<LoyaltyCard[] | "noCardDetected" | undefined>() 

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

    if (!loyaltyCardData) {setLoyaltyCards("noCardDetected")}

    if (loyaltyCardData && loyaltyCards != "noCardDetected" && progAddress) { 
      const data: LoyaltyCard[] = loyaltyCardData.map(item => { return ({
        cardId: item.ids[0], 
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

    if (loyaltyCards && loyaltyCards.length > 0 && loyaltyCards != "noCardDetected") { 
      try {
        for await (loyaltyCard of loyaltyCards) {

            const cardAddress: unknown = await publicClient.readContract({
              address: parseEthAddress(progAddress), 
              abi: loyaltyProgramAbi,
              functionName: 'getTokenBoundAddress', 
              args: [loyaltyCard.cardId]
            })
            console.log("getTokenBoundAddress: ", cardAddress )
            loyaltyCardsUpdated.push({...loyaltyCard, cardAddress: parseEthAddress(cardAddress)})
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
      loyaltyCards != "noCardDetected" && 
      loyaltyCards.findIndex(loyaltyCard => loyaltyCard.cardAddress) === -1 
      ) { getLoyaltyCardAddresses() } 
     
  }, [ , loyaltyCards])

  useEffect(() => {
    if (loyaltyCards) { setLoyaltyCards(undefined) } 
  }, [, address])

  return (
    <div className="grid grid-cols-1 h-full content-between pt-2">

      { 
      loyaltyCards && loyaltyCards.length == 0 ? 
        <RequestCard /> 
      : 
      loyaltyCards && loyaltyCards.length > 1 && !selectedLoyaltyCard ? 
        <SelectLoyaltyCard /> 
      :
      <div> </div> 
      }   
{/* 
      <div className="text-center p-3">
        <TitleText 
          title = {selectedLoyaltyProgram?.metadata ? selectedLoyaltyProgram?.metadata.attributes[0].value  : "Loyalty Card"} 
          subtitle="Scan to activate customer loyalty card" 
          size={2}
          /> 
      </div>
      <div className="grid justify-center justify-items-center p-6">
          <QRCode 
            value={`${BASE_URI}?customer/home/?prog:${selectedLoyaltyProgram?.programAddress}`}
            style={{ height: "500px", width: "100%", objectFit: "cover"  }}
            />
      </div>
      <div className="text-center p-3 pb-16">
        <Button isFilled={true} onClick = {() => dispatch(resetLoyaltyCard(true)) }> 
          Choose another Loyalty Card or Request a new one. 
        </Button>
      </div> */}
    </div>
    )
  }
