"use client";

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
import { selectLoyaltyCard } from '@/redux/reducers/loyaltyCardReducer';

// 0x8464135c8F25Da09e49BC8782676a84730C318bC

export default function SelectLoyaltyCard()  {
  const dispatch = useDispatch() 


  // const getLoyaltyCardIds = async () => {
  //   console.log("getLoyaltyCardIds called, address: ", address)

  //   const transferSingleData: Log[] = await publicClient.getContractEvents( { 
  //     abi: loyaltyProgramAbi,
  //     address: parseEthAddress(progAddress), 
  //     eventName: 'TransferSingle',
  //     args: {to: address}, 
  //     fromBlock: 1n,
  //     toBlock: 16330050n
  //   });
  //   const transferredTokens = parseTransferSingleLogs(transferSingleData)
  //   const loyaltyCardData = transferredTokens.filter(token => token.ids[0] != 0n)

  //   if (!loyaltyCardData) {setLoyaltyCards("noCardDetected")}

  //   if (loyaltyCardData && loyaltyCards != "noCardDetected" && progAddress) { 
  //     const data: LoyaltyCard[] = loyaltyCardData.map(item => { return ({
  //       cardId: item.ids[0], 
  //       loyaltyProgramAddress: parseEthAddress(progAddress)
  //     })})
  //     setLoyaltyCards(data)
  //   } 
  //   console.log("loyaltyCards: ", loyaltyCards)
  // }

  // const getLoyaltyCardAddresses = async () => {
  //   console.log("getLoyaltyCardAddresses called")

  //   let loyaltyCard: LoyaltyCard
  //   let loyaltyCardsUpdated: LoyaltyCard[] = []

  //   if (loyaltyCards && loyaltyCards.length > 0 && loyaltyCards != "noCardDetected") { 
  //     try {
  //       for await (loyaltyCard of loyaltyCards) {

  //           const cardAddress: unknown = await publicClient.readContract({
  //             address: parseEthAddress(progAddress), 
  //             abi: loyaltyProgramAbi,
  //             functionName: 'getTokenBoundAddress', 
  //             args: [loyaltyCard.cardId]
  //           })
  //           console.log("getTokenBoundAddress: ", cardAddress )
  //           loyaltyCardsUpdated.push({...loyaltyCard, cardAddress: parseEthAddress(cardAddress)})
  //         }
        
  //         setLoyaltyCards(loyaltyCardsUpdated)

  //       } catch (error) {
  //         console.log(error)
  //     }
  //   }
  // }

  // useEffect(() => {

  //   if (!loyaltyCards) { getLoyaltyCardIds() } // check when address has no cards what happens..  
  //   if (
  //     loyaltyCards && 
  //     loyaltyCards != "noCardDetected" && 
  //     loyaltyCards.findIndex(loyaltyCard => loyaltyCard.cardAddress) === -1 
  //     ) { getLoyaltyCardAddresses() } 
     
  // }, [ , loyaltyCards])

  // useEffect(() => {
  //   if (loyaltyCards) { setLoyaltyCards(undefined) } 
  // }, [, address])

  const handleProgramSelection = (loyaltyCard: LoyaltyCard) => {
    dispatch(selectLoyaltyCard(loyaltyCard))
  }

  // Choosing program. -- This is what I have to get working 100% 
  return (
    <div> 
      <TitleText title = "Choose Loyalty Card" subtitle="Choose Card or request a new one." size={1} /> 
      <div className="grid grid-rows-1 grid-flow-col h-full overflow-x-scroll overscroll-auto mb-12"> 
        {/* (The following div is an empty div for ui purposes)   */ }
        <div className="w-[16vw] h-96 ms-4 opacity-0 border-2 border-green-500" /> 
        {/* { loyaltyPrograms ? 
          loyaltyPrograms.map(program => {

            return (
              <button 
                key={program.tokenAddress}
                onClick = {() => handleProgramSelection(program)}
                  className="me-20 mt-12 w-72 h-128"> 
                      <Image
                        className="rounded-lg"
                        width={288}
                        height={420}
                        style = {{ objectFit: "cover" }} 
                        src={program.metadata? program.metadata.imageUri : `/vercel.svg`}
                        alt="DAO space icon"
                      />
              </button>
            )
          })
          : 
          null
        } */}

        {/* TODO: insert button here: 'deploy new program'  */}

      </div>
    </div>
  
    ) 
} 