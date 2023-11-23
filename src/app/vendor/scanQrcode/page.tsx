"use client"; 
import { QrReader } from 'react-qr-reader';
import { useEffect, useState } from "react";
import { useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';



export default function Page() {
  const [data, setData] = useState('No result'); 
  const video = document.getElementsByTagName('video');

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