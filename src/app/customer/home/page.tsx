
"use client"; 

import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { TitleText } from "../../ui/StandardisedFonts";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { resetLoyaltyCard } from '@/redux/reducers/loyaltyCardReducer';
import { usePublicClient } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { notification } from "@/redux/reducers/notificationReducer";
import { useLatestCustomerTransaction } from "@/app/hooks/useLatestTransaction";

export default function Page()  {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)
  const dispatch = useDispatch()
  const { pointsReceived } = useLatestCustomerTransaction() 

  useEffect(() => {
    if (pointsReceived) {
      dispatch(notification({
        id: "pointsReceived",
        message: `${pointsReceived?.values[0] } points received.`, 
        colour: "green",
        isVisible: true
      }))
    }
  }, [pointsReceived])

  return (
    <div className="flex flex-col justify-between justify-center pt-2">
      <TitleText 
        title = "Request Loyalty Points"
        subtitle="Let vendor scan this QR code to receive loyalty points" 
        size={2}
        /> 
         
      <div className="flex flex-col justify-self-center pt-2 pb-6 w-full md:px-48 px-6"> 
        <div className="text-center">
          {` Loyalty Card Id: ${selectedLoyaltyCard?.cardId}`}
        </div>
        <div className="pb-2 text-center border-b border-blue-800">
          {` Loyalty Card Address: ${selectedLoyaltyCard?.cardAddress?.slice(0,6)}...${selectedLoyaltyCard?.cardAddress?.slice(36,42)}`}
        </div>
      </div>
          
      <div className="flex flex-col justify-between p-2 h-full">
        <div className="grid justify-center justify-items-center">
            <QRCode 
              value={`type:giftPoints;lp:${selectedLoyaltyProgram?.programAddress};lc:${selectedLoyaltyCard?.cardAddress}`}
              style={{ height: "400px", width: "100%", objectFit: "cover"  }}
              />
        </div>
      </div>

      <div className="flex md:px-48 px-6">
        <Button onClick={() => dispatch(resetLoyaltyCard(true))} appearance="blueEmpty">
          Switch cards or Request new one
        </Button>
      </div> 

      <div className="h-16"/> 

    </div>  
    )
  }
