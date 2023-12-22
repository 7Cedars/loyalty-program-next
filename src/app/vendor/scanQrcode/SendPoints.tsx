// TODO 

import { Dispatch, SetStateAction } from "react";
import { QrData } from "@/types";
import { Button } from "@/app/ui/Button";

type SendPointsProps = {
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}
// use Setdata to reset qrdata when action is completed. 


export default function SendPoints({setData}: SendPointsProps)  {

  return (
    <div className="grid grid-cols-1">
  
      <div className="text-center p-3 pt-12">
        SEND POINTS
      </div>

      <div className="text-center p-3 pt-12" >
        <Button onClick={() => {setData(undefined)}}>
          Back to QR reader
        </Button>
      </div>
  
    </div>
    )
  } 