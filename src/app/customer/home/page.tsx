
"use client"; 

import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { TitleText } from "../../ui/StandardisedFonts";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { resetLoyaltyCard } from '@/redux/reducers/loyaltyCardReducer';
import { useEffect, useRef } from "react";
import { notification } from "@/redux/reducers/notificationReducer";
import { useLatestCustomerTransaction } from "@/app/hooks/useLatestTransaction";
import { DynamicLayout } from "../customerComponents/DynamicLayout";

export default function Page()  {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const dispatch = useDispatch()
  const { pointsReceived } = useLatestCustomerTransaction(true) 

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
    <div className="w-full h-full grid grid-cols-1 gap-1 ">
        <TitleText 
          title = "Request Loyalty Points"
          subtitle="Show this QR code to receive points" 
          size={2}
          /> 
          
        <div className="flex flex-col justify-self-center pt-2 pb-6 w-full md:px-48 px-6"> 
        {selectedLoyaltyCard ? 
          <>
            <div className="text-center">
              {` Loyalty Card Id: ${selectedLoyaltyCard?.cardId}`}
            </div>
            <div className="pb-2 text-center border-b border-slate-700">
              {` Loyalty Card Address: ${selectedLoyaltyCard?.cardAddress?.slice(0,6)}...${selectedLoyaltyCard?.cardAddress?.slice(36,42)}`}
            </div>
          </>
          : 
          null
        }
        </div>
            
        <div className="flex flex-col justify-between p-1 h-full">
          <div className="grid justify-center justify-items-center">
              <QRCode
                value={`type:giftPoints;${selectedLoyaltyCard?.cardAddress}`}
                style={{ 
                  height: "350px", 
                  width: "350px", 
                  objectFit: "cover", 
                  background: 'white', 
                  padding: '16px', 
                }}
                bgColor="#ffffff" // "#0f172a" 1e293b
                fgColor="#000000" // "#e2e8f0"
                level='L'
                className="rounded-lg"
                />
          </div>
        </div>

        <div className="flex md:px-48 px-6 h-14">
          <Button onClick={() => dispatch(resetLoyaltyCard(true))} appearance="grayEmpty">
            Switch cards or Request new one
          </Button>
        </div> 

        <div className="h-14"/> 
    </div>  
    )
  }
