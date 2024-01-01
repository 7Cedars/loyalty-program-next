"use client";

import { Dispatch, SetStateAction } from "react";
import { NumPad } from "@/app/ui/NumPad";
import { useState } from "react";
import { Button } from "@/app/ui/Button";

type RedeemTokenProps = {
  modal: 'points' | 'cards' | undefined;  
  setModal: Dispatch<SetStateAction<'points' | 'cards' | undefined>>; 
}

export default function MintPoints( {modal, setModal}: RedeemTokenProps ) {
  const [numpadNumber, setNumpadNumber] = useState<number>()

  const handleMint = () => {

  } 
  
  const handleChange = (number: number) => {
    setNumpadNumber(number)
    console.log("NUMPAD number: ", number)
  }

  return (
    <div className="p-3 px-12 pt-12 grid grid-cols-1 justify-items-center"> 
      <text className="text-2xl text-center p-3">
        {`${numpadNumber} points`}
      </text>
      <div className="max-w-xl"> 
        <NumPad onChange={(number: number) => handleChange(number) } /> 
   
        <div className="flex mt-3"> 
          <Button appearance = {"blueFilled"} onClick={ () => handleMint}>
            Mint Points
          </Button>
        </div>
      </div>
    </div>      
  );
}