// TODO 

import { Dispatch, SetStateAction } from "react";
import { QrData } from "@/types";
import { Button } from "@/app/ui/Button";

type RedeemTokenProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}
// use Setdata to reset qrdata when action is completed. 


export default function RedeemToken({qrData, setData}: RedeemTokenProps)  {

return (
  <div className="grid grid-cols-1">

    

    <div className="text-center p-3 pt-12">
      REDEEM TOKEN
    </div>

    <div className="text-center p-3 pt-12" >
      <Button onClick={() => {setData(undefined)}}>
        Back to QR reader
      </Button>
    </div>

  </div>
  )
} 