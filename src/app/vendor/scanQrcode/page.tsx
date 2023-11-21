"use client"; 
import { QrReader } from 'react-qr-reader';
import { useState } from "react";

export default function Page() {
  const [data, setData] = useState('No result');
  const cameraOn:boolean = false; 

  return (

    <div className="grid grid-cols-1">

      <div className="text-center p-3">
        Scan customer QR code 
      </div>
      <div className="flex justify-center justify-items-center border-red-500 pt-6">

        { cameraOn ? 
          <QrReader 
            className = 'h-full w-full'
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
          : 
          null
          }
      </div>
      <div className="text-center p-3 pt-12">
      {data}
      </div>
  </div>

  );
}