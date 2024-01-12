// 

import { useState } from "react";
import { Button } from "./Button";
import { BackspaceIcon } from "@heroicons/react/24/outline";

type NumPadProps = {
  onChange: (arg0: number) => void;
};

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0'] 

export const NumPad = ({
  onChange,
}: NumPadProps) => {

  const [fullNumberString, setFullNumberString] = useState<string>('0')  

  const handleChange= ({target}: {target: string}) => {

    if (target === '' || undefined) {target = '0'}
    setFullNumberString(target)
    
    if(typeof onChange === 'function'){
      onChange( parseInt(target))
    }    
  }

  return (
    <div className="grid grid-cols-3 w-72"> 
    {
      numbers.map(number => 
        <div key = {number} className="flex w-24 h-16">
          <Button  appearance = {"blueEmpty"} onClick={() => handleChange({target: fullNumberString.concat(number)})} >
                {number} 
          </Button>
        </div>
      )
    }
      <div className="grow flex px-1"> 
        <Button appearance = {"blueEmpty"} onClick={ () => handleChange({target: fullNumberString.slice(0, -1)})} >
          <BackspaceIcon
              className='h-5 w-5 m-2'
              aria-hidden="true"
            />
        </Button>
      </div>
    </div>
  );
};
