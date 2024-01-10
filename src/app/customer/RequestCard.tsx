
"use client"; 

import QRCode from "react-qr-code";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { useAppSelector } from "@/redux/hooks";
import { useAccount } from "wagmi";

export default function RequestCard()  {
  const { address } = useAccount() 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )

  return (
    <div className="grid grid-cols-1 h-4/5 content-between pt-2">

      <div className="text-center p-3">
        <TitleText 
          title = "Request Loyalty Card"
          subtitle="Let vendor scan this QR code to request a loyalty card" 
          size={2}
          /> 
      </div>
      <div className="grid justify-center justify-items-center p-6">
          <QRCode 
            value={`type:requestCard;lp:${selectedLoyaltyProgram?.programAddress};ca:${address}`}
            style={{ height: "400px", width: "100%", objectFit: "cover"  }}
            />
      </div>
      
      <div className="h-16"/> 
    </div>
    )
  }
