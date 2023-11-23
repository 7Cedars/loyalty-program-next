// TODO 

import { Button } from "@/app/ui/Button";

import { useContractRead } from 'wagmi'
import { loyaltyProgramAbi } from "@/context/abi";
import { useRef, useState } from "react";

type InputProps = {
  type: "points" | "tokens" | "cards"
  presetAmounts: string[] // numbers are treated as strings in this component. If need be, they can be parsed to integers later on.  
}

export function InputForm({type, presetAmounts}: InputProps)  {

  const [output, setOutput] = useState(''); // note that this has to be properly parsed at some point

  const handler = () => { }

return (
  <div className="grid grid-cols-1 gap-1 max-w-lg justify-items-center h-56">
    
    <div className="flex flex-row text-center p-3">
      {presetAmounts.map((amount: string) => 
        <div key = {amount}> 
          <Button isFilled={true} size = "md" onClick={() => setOutput(amount)}>
            {amount}
          </Button>
        </div>
      )
      } 
    </div>
    <div>

    <input 
      type = "number" placeholder="custom amount" value = {output} onChange={(event => setOutput(event.target.value))} 
      className="border border-blue-300 outline-none  hover:border-blue-500 text-center text-blue-700 focus:border-blue-700 rounded-lg p-3 px-12 text-md w-full max-h-12" 
    />

   

    </div>
    <div className="text-center p-3 pt-3">
      <Button isFilled={true} onClick={() =>  handler}>
        Mint Loyalty {type} 
      </Button>
    </div>
  </div>
  )
} 