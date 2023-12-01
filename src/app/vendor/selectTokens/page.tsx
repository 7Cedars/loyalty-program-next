"use client"; 
import { ModalMain } from "@/app/components/ModalMain";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";
import { TitleText } from "@/app/ui/TitleText";
import TokenSmall from "./TokenSmall";
import { LoyaltyToken } from "@/types";
import { useEffect, useState } from "react";



export default function Page() {

  const [LoyaltyTokens, setLoyaltyTokens] = useState<LoyaltyToken[]>() 
  const {data, logs, isLoading} = useLoyaltyTokens() 

  useEffect(() => {

    if (data) {
      setLoyaltyTokens(data)
    }

  }, [, data])

  console.log("data loyaltyTokens: ", data)

  return (
     <div className=" w-full grid grid-cols-1 gap-1 ">
      <div className="h-20 m-3"> 
       <TitleText title = "Select Loyalty Gifts" subtitle="View and select gifts that customers can claim with their loyalty points." size={1} />
      </div> 
        
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
        <div className="col-span-2 sm:col-span-3 md:col-span-4"> 
          <TitleText title = "Selected Gifts" size={0} />
        </div>
        
        { LoyaltyTokens ? 
          LoyaltyTokens.map((token: LoyaltyToken) => 
            <div key = {token.tokenAddress} >
              <TokenSmall token = {token} disabled = {false}  /> 
            </div>
          )
          : 
          null
        }
      
      </div> 
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
        <div className="col-span-2 sm:col-span-3 md:col-span-4"> 
          <TitleText title = "Available Gift Programs" size={0} />
        </div>
        
        { LoyaltyTokens ? 
          LoyaltyTokens.map((token: LoyaltyToken) => 
            <div key = {token.tokenAddress} >
              <TokenSmall token = {token} disabled = {true}  /> 
            </div>
          )
          : 
          null
        }
      </div>

    </div> 
  );
}
