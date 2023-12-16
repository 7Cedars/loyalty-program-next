// TODO 

import { Dispatch, SetStateAction } from "react";
import { QrData } from "@/types";

type SendPointsProps = {
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}

export default function SendPoints({setData}: SendPointsProps)  {

  return (
    <div className="grid grid-cols-1">
  
      <div className="text-center p-3 pt-12">
        SEND POINTS
      </div>
  
    </div>
    )
  } 