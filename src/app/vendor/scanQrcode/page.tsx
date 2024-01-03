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

export default function Page() {
  const [data, setData] = useState<QrData>(); 
  const {address} = useAccount();  
  const video = document.getElementsByTagName('video');
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
    <>

    { !data ?   

    <div className="grid grid-cols-1 pt-12">
      <TitleText title = "Scan customer QR code" subtitle='Send loyalty card, redeem gifts or transfer points' size={1} /> 
      <div className="flex items-center justify-items-center pt-3">
        {/* <div className='text-center text-2xl h-4/5 w-4/5 p-6 border border-gray-500 pb-12 rounded-lg'> */}

        
      <div className='w-full p-4'> 
          <QrReader 
            ViewFinder={ViewFinder}
            videoStyle={{ objectFit: 'cover' }}
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (!!result) {
                const qrData = parseQrData(result?.getText()) 
                setData(qrData);
              }

              if (!!error) {
                console.info("No QR code detected.");
              }
            }}            
          />
          </div>
        {/* </div> */}
      </div>
  </div>
  : 
  data.type === "giftPoints" ? <SendPoints setData = {setData}/> 
  : 
  data.type === "redeemToken" ? <RedeemToken setData = {setData}/> 
  :
  data.type === "requestCard" ? <TransferCard qrData = {data} setData = {setData}/>
  : null
  }

  </>

  );
}