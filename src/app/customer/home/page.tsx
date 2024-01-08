
"use client"; 

// Will do clean up later. 
import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { TitleText } from "../../ui/StandardisedFonts";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { resetLoyaltyCard } from '@/redux/reducers/loyaltyCardReducer';

export default function Page()  {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)
  const dispatch = useDispatch() 

  return (
    <div className="flex flex-col justify-between pt-2 h-full">
      <div className="grow"> 
        <div className="grid grid-cols-1 h-4/5 content-between pt-2">

        <div className="text-center p-3">
          <TitleText 
            title = "Request Loyalty Points"
            subtitle="Let vendor scan this QR code to receive loyalty points" 
            size={2}
            /> 
        </div>
        <div className="flex justify-center"> 
          <div className="p-2 w-1/2 text-center border-b border-blue-800">
            {` Loyalty Card Id: ${selectedLoyaltyCard?.cardId}`}
          </div>
        </div>
        <div className="grid justify-center justify-items-center p-6">
            <QRCode 
              value={`type:giftPoints;lp:${selectedLoyaltyProgram?.programAddress};lc:${selectedLoyaltyCard?.cardAddress}`}
              style={{ height: "400px", width: "100%", objectFit: "cover"  }}
              />
        </div>
        </div>
      </div>

      <div className="grow-0 grid grid-cols-1">
        <Button onClick={() => dispatch(resetLoyaltyCard(true))} appearance="blueEmpty">
          Switch cards or Request new one
        </Button>
      </div> 
      <div className="h-16"/> 
    </div>  
    )
  }
