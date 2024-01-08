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

export default function SelectLoyaltyCard({loyaltyCards}: {loyaltyCards: LoyaltyCard[]}) {
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)
  const dispatch = useDispatch() 

  // Choosing program. -- This is what I have to get working 100% 
  return (
    <div> 
      <TitleText title = "Choose Loyalty Card" subtitle="Choose Card or request a new one." size={1} /> 
      <div className="grid grid-rows-1 grid-flow-col h-full overflow-x-scroll overscroll-auto mb-12"> 
        {/* (The following div is an empty div for ui purposes)   */ }
        <div className="w-[16vw] h-96 me-8 ms-4 opacity-0 border-2 border-green-500" /> 
        { loyaltyCards && selectedLoyaltyProgram ? 
          loyaltyCards.map(card => {

            return (                
              <button 
                key={String(card.cardId)}
                onClick = {() => dispatch(selectLoyaltyCard(card))}
                className="me-20 mt-6 w-60 p-3 h-fit justify-self-center border border-gray-300 rounded-lg grid grid-cols-1 gap-4"> 
                  <div className='text-center h-fit'> 
                    {`Card ID: ${Number(card.cardId)}`} 
                  </div> 

                  <Image
                    className="rounded-lg "
                    width={288}
                    height={420}
                    style = {{ objectFit: "cover" }} 
                    src={selectedLoyaltyProgram.metadata? selectedLoyaltyProgram.metadata.imageUri : `/vercel.svg`}
                    alt="DAO space icon"
                  />

                  <div className='text-center'>   
                    POINTS HERE 
                  </div> 
              </button>
            )
          })
          : 
          null
        }

      </div>
    </div>
  
    ) 
} 