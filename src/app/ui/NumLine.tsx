// I am using this as an example for now to create modular range slider (and modal). 
// Taken from react-graph-gallery github repo.  

// 

import { useState } from "react";
import { Button } from "./Button";
import Image from "next/image";

type NumLineProps = {
  onClick: (arg0: number) => void;
  appearance?: "blueFilled" | "grayEmpty";
  isLoading: boolean;
};

const appearanceButtons = {
  blueFilled:  "rounded m-1 grow text-md text-cen bg-blue-500 hover:bg-blue-600 text-white"   
}
const numbers = [1, 5, 25, 150] // this can be flexible input. 

export const NumLine = ({
  onClick,
  appearance = "grayEmpty", 
  isLoading = false
}: NumLineProps) => {

  const [ selectedAmount, setSelectedAmount ] = useState<number>(25) 

  const handleClick= (selectedAmount: number) => {
    if(typeof onClick === 'function'){
      onClick(selectedAmount)
   }    
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
          <Button  appearance = {"grayEmpty"} onClick={() => setSelectedAmount(number)} >
                {number} 
          </Button>
        </div>
      )
    }
      <div className="grow flex px-1"> 
        { !isLoading ? 

        <Button appearance = {"grayEmpty"} onClick={ () => handleClick(selectedAmount)} >
            Mint {selectedAmount} Loyalty Gifts
        </Button>
        : 
        <Button appearance = {"grayEmpty"} onClick={() => {}} >
            <div className="flex justify-center items-center">
              <Image
                className="rounded-lg opacity-25 flex-none mx-3 animate-spin"
                width={30}
                height={30}
                src={"/loading.svg"}
                alt="Loading icon"
              />
            </div>
          </Button>
      }
      </div>
    </div>
  );
};
