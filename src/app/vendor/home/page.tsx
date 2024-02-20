
"use client"; 

// Will do clean up later. 
import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { BASE_URI } from "@/context/constants";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { useDispatch } from "react-redux";
import { resetLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { useAppSelector } from "@/redux/hooks";
import { parseEthAddress } from "@/app/utils/parsers";

export default function Page()  {
  const dispatch = useDispatch() 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )

  return (
     
    <div className="grid grid-cols-1 h-full content-between pt-6">
      
        <TitleText 
          title = {selectedLoyaltyProgram?.metadata ? selectedLoyaltyProgram?.metadata.attributes[0].value  : "Loyalty Card"} 
          subtitle="Let customer scan this code to activate loyalty card" 
          size={2}
          /> 
      <div className="grid justify-center justify-items-center p-6 h-full max-w-24 rounded-lg m-3">
        <QRCode 
          value={`${BASE_URI}/customer/home?prog=${parseEthAddress(selectedLoyaltyProgram?.programAddress)}`}
          style={{ 
            height: "350px", 
            width: "350px", 
            objectFit: "cover", 
            background: 'white', 
            padding: '16px', 
          }}
          bgColor="#ffffff" // "#0f172a" 1e293b
          fgColor="#000000" // "#e2e8f0"
          level='M'
          className="rounded-lg"
          />
      </div>
      <div className="flex md:px-48 px-4">
        <Button isFilled={true} onClick = {() => dispatch(resetLoyaltyProgram(true)) }> 
          Choose another Loyalty Program
        </Button>
      </div>

      <div className="h-24"/> 
    </div>
    )
  }
