
"use client"; 

import QRCode from "react-qr-code";
import { useAppSelector } from '@/redux/hooks';
import { LoyaltyToken } from "@/types";
import { Hex} from "viem";

export default function RedeemToken({token, signature}: {token: LoyaltyToken, signature: Hex})  {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)

  console.log("signature message: ", signature)

  return (
    <>
    <div className="flex flex-col justify-between pt-2 h-full">
      <div className="grow"> 
        <div className="grid justify-center justify-items-center p-6">
            <QRCode 
              value={`type:redeemToken;lp:${selectedLoyaltyProgram?.programAddress};lc:${selectedLoyaltyCard?.cardAddress};lt:${token.tokenAddress};ti:${token.tokenId};sg:${signature}`}
              style={{ height: "400px", width: "100%", objectFit: "cover"  }}
              />
        </div>
        </div>
      </div>
      <div className="h-16"/> 
    </>
    )
  }
