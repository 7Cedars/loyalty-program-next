
"use client"; 

import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { useDispatch } from "react-redux";
import { resetLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { useAppSelector } from "@/redux/hooks";
import { parseEthAddress, parseUri } from "@/app/utils/parsers";
import { useNetwork } from "wagmi";

export default function Page()  {
  const dispatch = useDispatch() 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { chain } =  useNetwork()

  console.log("chain: ", chain?.id )

  return (
     
    <div className="grid grid-cols-1 h-full content-between pt-6">
      
        <TitleText 
          title = {selectedLoyaltyProgram?.metadata ? selectedLoyaltyProgram?.metadata.attributes[0].value  : "Loyalty Card"} 
          subtitle="Let customer scan this code to activate loyalty card" 
          size={2}
          /> 
      <div className="grid justify-center justify-items-center p-6 h-full max-w-24 rounded-lg m-3">
        <QRCode 
          value={`${process.env.NEXT_PUBLIC_BASE_URI}/landing?prog=${parseEthAddress(selectedLoyaltyProgram?.programAddress)}&proguri=${parseUri(selectedLoyaltyProgram?.metadata?.imageUri)}&chainId=${chain?.id}`}
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
