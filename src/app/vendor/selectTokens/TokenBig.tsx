"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";

type SelectedTokenProps = {
  token: LoyaltyToken
  disabled: boolean
}

const handleClick = () => {
  // dummy func
}

export default function TokenBig( {token, disabled}: SelectedTokenProps ) {
  const dimensions = useScreenDimensions();  

  console.log("data loyaltyTokens: ", token)
  // let appearance = `h-full w-11/12 m-2 grid grid-cols-2 border rounded-lg border-gray-200`

  return (
    <div className="grid grid-cols-1"> 

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center "> 
      
        <div className="rounded-lg w-max"> 
          <Image
              className="rounded-lg"
              width={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
              height={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
              src={token.metadata.imageUri}
              alt="Loyalty Token icon "
            />
        </div>
        
        <div className="grid grid-cols-1 p-2 content-start">
          <div className="text-center text-sm"> 
            {`${token.metadata.attributes[1].value} ${token.metadata.attributes[1].trait_type}`}
          </div> 
          <div className="text-center text-sm text-gray-500"> 
            {token.metadata.description}
          </div>
        
        </div>
      </div>

      { disabled ? 
        <div className="p-3 flex"> 
          <Button appearance = {"greenEmpty"} onClick={() => handleClick} >
            Select Token
          </Button>
        </div> 
        : 
        <div className="p-3 flex"> 
          <Button appearance = {"redEmpty"}  onClick={() => handleClick} >
            Deselect Token
          </Button>
        </div>
      } 
    </div>      
  );
}