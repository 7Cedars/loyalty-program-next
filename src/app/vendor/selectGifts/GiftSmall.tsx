"use client"; 
import { LoyaltyGift } from "@/types";
import Image from "next/image";

type SelectedTokenProps = {
  token: LoyaltyGift; 
  disabled: boolean;
  onClick: () => void;
}

export default function SelectToken( {token, disabled, onClick}: SelectedTokenProps ) {
  let appearance = `h-72 w-40 m-2 grid grid-cols-1 border rounded-lg border-gray-700 dark:border-gray-200 ${ disabled ? 'opacity-50' : null} `

  return (
     
      <button className={appearance} onClick={onClick}> 
      {token.metadata ? 
        <>
          <Image
              className="rounded-t-lg"
              width={160}
              height={160}
              src={token.metadata.imageUri}
              alt="Loyalty Gift icon "
            />
          <div className="grid grid-cols-1 p-2 content-start">
            <div className="text-center text-sm"> 
              {token.metadata.name}
            </div>
            { token.isClaimable == 1n ? 
              <div className="text-center text-sm text-gray-500 mt-1"> 
                {`${token.cost} points`}
              </div> 
              :
              <div className="text-center text-sm text-gray-500"> 
                {`Cannot be exchanged for points.`}
              </div>
            }            
            { token.isVoucher == 1n? 
              <div className="text-center text-sm text-gray-500"> 
                {`${Number(token.availableVouchers)} vouchers left`}
              </div>
              :
              <div className="text-center text-sm text-gray-500"> 
                {`Unlimited supply`}
              </div>
            }
          </div> 
        </>
          : 
          <div> loading </div>
      }
      </button>
  );
}