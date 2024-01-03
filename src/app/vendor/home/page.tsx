
"use client"; 

// Will do clean up later. 
import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { BASE_URI } from "@/context/constants";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { useDispatch } from "react-redux";
import { resetLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { useAppSelector } from "@/redux/hooks";

export default function Page()  {
  const dispatch = useDispatch() 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )

  return (
    <div className="grid grid-cols-1 h-full content-between pt-2">

      <div className="text-center p-3">
        <TitleText 
          title = {selectedLoyaltyProgram?.metadata ? selectedLoyaltyProgram?.metadata.attributes[0].value  : "Loyalty Card"} 
          subtitle="Scan to activate customer loyalty card" 
          size={2}
          /> 
      </div>
      <div className="grid justify-center justify-items-center p-6">
          <QRCode 
            value={`${BASE_URI}?customer/landing/?prog:${selectedLoyaltyProgram?.programAddress}`}
            style={{ height: "500px", width: "100%", objectFit: "cover"  }}
            />
      </div>
      <div className="text-center p-3 pb-16">
        <Button isFilled={true} onClick = {() => dispatch(resetLoyaltyProgram(true)) }> 
          Choose another Loyalty Program
        </Button>
      </div>
    </div>
    )
  }
