"use client"; 
import { QrReader } from 'react-qr-reader';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import { useAccount } from 'wagmi';
import { TitleText } from '@/app/ui/StandardisedFonts';
import { ViewFinder } from '@/app/ui/ViewFinder';
import { QrData } from '@/types';
import { parseQrData } from '@/app/utils/parsers';

import SendPoints from './SendPoints';
import ClaimGift from './ClaimGift';
import RedeemToken from './RedeemVoucher';
import TransferCard from './TransferCard';

export default function Page() {
  const [data, setData] = useState<QrData>(); 
  const {address} = useAccount();  
  const dispatch = useDispatch();  

  console.log("DATA QR: ", data)

  if (!address) {
    dispatch(notification({
      id: "NotLoggedIn",
      message: "You are not connected to a network.", 
      colour: "red",
      loginButton: true, 
      isVisible: true
    }))
  } else {
    dispatch(updateNotificationVisibility({
      id: "LoggedIn",
      isVisible: false
    }))
  }

  return (
    <div className='h-full'>

    { data && data.type === "giftPoints" ? <SendPoints qrData = {data} setData = {setData}/> 
      : 
      data && data.type === "claimGift" ? <ClaimGift qrData = {data} setData = {setData}/> 
      : 
      data && data.type === "redeemToken" ? <RedeemToken qrData = {data} setData = {setData}/> 
      :
      data && data.type === "requestCard" ? <TransferCard qrData = {data} setData = {setData}/>
      :
      <div className="grid grid-cols-1 h-full content-between">
        <TitleText title = "Scan customer QR code" subtitle='Send loyalty card, redeem gifts or transfer points' size={2} /> 
        <div className="grid grid-cols-1 pt-3 justify-items-center">
          <div className='w-full sm:w-2/3 p-4'> 
            <QrReader 
              ViewFinder={ViewFinder}
              videoStyle={{ objectFit: 'cover' }}
              constraints={{ facingMode: 'environment' }}
              onResult={(result, error) => {
                if (!!result) {
                  const qrData = parseQrData(result?.getText()) 
                  console.log("qrData parsed: ", qrData)
                  setData(qrData);
                }
                if (!!error) {
                  console.info("No QR code detected.");
                  // setData(undefined)
                  // result = null 
                  // error = null 
                }
              }}            
            />
          </div>
        </div>
        <div className='pb-24'/>
      </div>
    }
    </div>
  );
}