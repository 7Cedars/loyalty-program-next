"use client"; 
import { QrReader } from 'react-qr-reader';
import { useEffect, useState } from "react";
import { useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';
import { useDispatch } from "react-redux";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import { useAccount } from 'wagmi';
import { TitleText } from '@/app/ui/StandardisedFonts';
import { ViewFinder } from '@/app/ui/ViewFinder';
import { QrData } from '@/types';
import { parseQrData } from '@/app/utils/parsers';
import RedeemToken from './RedeemToken';
import SendPoints from './SendPoints';
import TransferCard from './TransferCard';
import ClaimGift from './ClaimGift';
import { Button } from '@/app/ui/Button';

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
          <div className='w-full sm:w-2/3 p-1'> 
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
        <div className='flex justify-items-center p-1'>
          {/*  WIP  */}
          <Button appearance='blueEmpty' onClick={() => setData(undefined) } > 
            Reset scanner
          </Button>
        </div>
        <div className='pb-16'/>
      </div>
    }
    </div>
  );
}