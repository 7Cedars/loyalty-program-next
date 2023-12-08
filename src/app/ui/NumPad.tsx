// I am using this as an example for now to create modular range slider (and modal). 
// Taken from react-graph-gallery github repo.  

// 

import { useState } from "react";
import { Button } from "./Button";

type NumPadProps = {
  onClick: (arg0: number) => void;
  appearance?: "blueFilled" | "blueEmpty" 
};

const appearanceButtons = {
  blueFilled:  "rounded m-1 grow text-md text-cen bg-blue-500 hover:bg-blue-600 text-white"   
}
const numbers = [1, 5, 25, 150]



export const NumPad = ({
  onClick,
  appearance = "blueEmpty"
}: NumPadProps) => {

  const [ selectedAmount, setSelectedAmount ] = useState<number>(25) 

  const handleClick= (selectedAmount: number) => {
    if(typeof onClick === 'function'){
      // call the callback passing in whatever parameters you decide
      // in this simple case just sending numeric value
      onClick(selectedAmount)
   }    
    // dummy for now
  }

  return (
    <div className="flex grow"> 
    {
      numbers.map(number => 
        number === selectedAmount ? 
        <div key = {number} className="flex"> 
          <Button  appearance = {"blueFilled"} onClick={() => setSelectedAmount(number)} >
                {number} 
          </Button>
        </div>
        :
        <div key = {number} className="flex"> 
          <Button  appearance = {"blueEmpty"} onClick={() => setSelectedAmount(number)} >
                {number} 
          </Button>
        </div>
      )
    }
      <div className="grow flex px-1"> 
        <Button appearance = {"blueEmpty"} onClick={ () => handleClick(selectedAmount)} >
            Mint {selectedAmount} Loyalty Gifts
        </Button>
      </div>
    </div>
  );
};
