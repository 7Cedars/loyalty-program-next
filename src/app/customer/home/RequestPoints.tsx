
"use client"; 

import QRCode from "react-qr-code";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { useAppSelector } from "@/redux/hooks";

export default function RequestPoints()  {
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)
  const { selectedLoyaltyCard  } = useAppSelector(state => state.selectedLoyaltyCard)

  return (
    <div className="grid grid-cols-1 h-4/5 content-between pt-2">

      <div className="text-center p-3">
        <TitleText 
          title = "Request Loyalty Points"
          subtitle="Let vendor scan this QR code to receive loyalty points" 
          size={2}
          /> 
      </div>
      <div className="grid justify-center justify-items-center p-6">
          <QRCode 
            value={`type:giftPoints;lp:${selectedLoyaltyProgram?.programAddress};lc:${selectedLoyaltyCard?.cardId}`}
            style={{ height: "400px", width: "100%", objectFit: "cover"  }}
            />
      </div>
    </div>
    )
  }
