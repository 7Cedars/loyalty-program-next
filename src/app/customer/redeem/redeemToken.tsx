
"use client"; 

// Will do clean up later. 
import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { TitleText } from "../../ui/StandardisedFonts";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { resetLoyaltyCard } from '@/redux/reducers/loyaltyCardReducer';
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function RedeemToken({token}: {token: LoyaltyToken})  {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)

  return (
    <>
    <div className="flex flex-col justify-between pt-2 h-full">
      <div className="grow"> 
        <div className="grid justify-center justify-items-center p-6">
            <QRCode 
              value={`type:redeemToken;lp:${selectedLoyaltyProgram?.programAddress};lc:${selectedLoyaltyCard?.cardAddress};lt:${token.tokenAddress};ti:${token.tokenId}`}
              style={{ height: "400px", width: "100%", objectFit: "cover"  }}
              />
        </div>
        </div>
      </div>
      <div className="h-16"/> 
    </>
    )
  }
