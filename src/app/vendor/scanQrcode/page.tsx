"use client"; 
import { QrReader } from 'react-qr-reader';
import { useEffect, useState } from "react";
import { useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

export default function Page() {
  const [data, setData] = useState('No result'); 
  const {address} = useAccount();  
  const video = document.getElementsByTagName('video');
  const dispatch = useDispatch();  
  const router = useRouter() 

  if (!address) {
    // dispatch(notification({
    //   id: "NotLoggedIn",
    //   message: "You are not logged in. Redirected to login page", 
    //   colour: "red", 
    //   isVisible: true
    // }))
    // router.push(`/vendor/login`)
  }

  return (

    <div className="grid grid-cols-1 pt-12">
      <div className="flex justify-center justify-items-center pt-3">
        <div className='text-center text-2xl h-4/5 w-4/5 p-6 border border-gray-500 pb-12 rounded-lg'>
        Scan customer QR code 

          <QrReader 
          className='pb-12 rounded-lg'
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (!!result) {
                setData(result?.getText());
              }

              if (!!error) {
                console.info(error);
              }
            }}
          />
        </div>
      </div>
  </div>

  );
}