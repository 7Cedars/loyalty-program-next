
"use client"; 

// Will do clean up later. 
import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { BASE_URI } from "@/context/constants";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { useDispatch } from "react-redux";
import { resetLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { useAppSelector } from "@/redux/hooks";
import { useAccount } from "wagmi";

export default function RequestCard()  {
  const dispatch = useDispatch()
  const { address } = useAccount() 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )

  return (
    <div className="grid grid-cols-1 h-full content-between pt-2">

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
            style={{ height: "500px", width: "100%", objectFit: "cover"  }}
            />
      </div>
    </div>
    )
  }
