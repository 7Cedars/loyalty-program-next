// TODO 

import { Dispatch, SetStateAction } from "react";
import { QrData } from "@/types";

type RedeemTokenProps = {
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}

export default function TransferCard({setData}: RedeemTokenProps)  {

  return (
    <div className="grid grid-cols-1">
  
      <div className="text-center p-3 pt-12">
        TRANSFER CARD
      </div>
  
    </div>
    )
  } 