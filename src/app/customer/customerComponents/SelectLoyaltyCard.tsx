"use client";

import { useAccount } from 'wagmi'
import { EthAddress, LoyaltyCard, LoyaltyProgram } from "@/types";
import { TitleText } from "../../ui/StandardisedFonts";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUrlProgramAddress } from '../../hooks/useUrl';
import { usePublicClient } from 'wagmi';
import { loyaltyProgramAbi } from '@/context/abi';
import {  parseEthAddress } from '../../utils/parsers';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { selectLoyaltyCard } from '@/redux/reducers/loyaltyCardReducer';
import { parseBigInt } from '../../utils/parsers';
import RequestCard from './RequestCard';
import { Button } from '@/app/ui/Button';

export default function SelectLoyaltyCard({loyaltyCards}: {loyaltyCards: LoyaltyCard[]}) {
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)
  const [loyaltyCardPoints, setLoyaltyCardPoints ] = useState<{cardAddress: EthAddress | undefined, points: Number}[] | undefined >() 
  const [requestCard, setRequestCard] = useState<boolean>(false); 
  const publicClient = usePublicClient(); 
  const dispatch = useDispatch() 

  const getLoyaltyCardsPoints = async () => {
    let loyaltyCard: LoyaltyCard
    let loyaltyPointsUpdated: {cardAddress: EthAddress | undefined, points: Number}[] = []

    if (loyaltyCards && publicClient) { 

      try {
        for await (loyaltyCard of loyaltyCards) {

          const loyaltyCardPointsData = await publicClient.readContract({
              address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
              abi: loyaltyProgramAbi,
              functionName: 'getBalanceLoyaltyCard', 
              args: [ loyaltyCard.cardAddress ]
            });
            loyaltyPointsUpdated.push({cardAddress: loyaltyCard.cardAddress, points: Number(parseBigInt(loyaltyCardPointsData))})

            if (loyaltyPointsUpdated) setLoyaltyCardPoints(loyaltyPointsUpdated)
          }
        } catch (error) {
          console.log("getBalanceLoyaltyCard error: ", error)
      }
    }
  }

  useEffect(() => {
    getLoyaltyCardsPoints() 
  }, [])

  return (
    <>
    { 
    requestCard ? 
      <div className='flex flex-col'>
        <RequestCard /> 
        <div className='flex w-full justify-center'> 
          <div className='flex w-96'>
            <Button onClick={() => setRequestCard(false)}>
              Return to choosing card
            </Button>
          </div>
        </div>
      </div>
      :
      <div className='flex flex-col mx-4 justify-center content-center' > 
        <TitleText title = "Choose Loyalty Card" subtitle="Choose Card or request a new one." size={2} /> 
        <div className="grid grid-rows-1 grid-flow-col h-full overflow-auto mb-12 justify-items-center"> 
            
          { loyaltyCards && selectedLoyaltyProgram ? 
            loyaltyCards.map(card => 
                          
                <button 
                  key={String(card.cardId)}
                  onClick = {() => dispatch(selectLoyaltyCard(card))}
                  className="m-6 mt-6 w-60 p-3 h-fit justify-self-center border border-gray-300 rounded-lg grid grid-cols-1 gap-1"> 
                    <div className='text-center h-fit'> 
                      {`Card id: ${Number(card.cardId)}`} 
                    </div> 
                    <div className='text-center h-fit'> 
                      {`Address: ${card.cardAddress?.slice(0,6)}...${card.cardAddress?.slice(36,42)}`} 
                    </div> 

                    <Image
                      className="rounded-lg "
                      width={288}
                      height={420}
                      style = {{ objectFit: "cover" }} 
                      src={selectedLoyaltyProgram.metadata? selectedLoyaltyProgram.metadata.imageUri : `/images/loading2.svg`}
                      alt="Loyalty Card Icon"
                    />

                    {loyaltyCardPoints && card.cardAddress? 
                      <div className='text-center'>   
                      {`${loyaltyCardPoints.find(cardPoints => cardPoints.cardAddress === card.cardAddress)?.points} points`} 
                      </div> 
                      : 
                      null
                    }
                </button>
            )
            : 
            null
          }

        </div>
          <div className='flex w-full justify-center'> 
            <div className='flex w-96'>
            <Button onClick={() => setRequestCard(true)}>
              Request new Card
            </Button>
            </div>
          </div>
      </div>
                
      }
    </>
    ) 
} 