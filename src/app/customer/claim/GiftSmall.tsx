"use client"; 
import { LoyaltyGift } from "@/types";
import Image from "next/image";

type SelectedTokenProps = {
  token: LoyaltyGift; 
  disabled: boolean;
  onClick: () => void;
}

export default function SelectToken( {token, disabled, onClick}: SelectedTokenProps ) {
  let appearance = `h-72 w-40 m-2 grid grid-cols-1 border rounded-lg border-slate-800 dark:border-slate-200 ${ disabled ? 'opacity-50' : null} `

  return (
     
      <button className={appearance} onClick={onClick}> 
       {token.metadata ? 
        <>
          <Image
              className="rounded-t-lg"
              width={160}
              height={160}
              src={token.metadata.imageUri}
              alt="Loyalty Token icon "
            />
          <div className="grid grid-cols-1 p-2 content-start">
            <div className="text-center text-sm"> 
              {token.metadata.description}
            </div>
            <div className="text-center text-sm text-gray-500 mt-1"> 
              {`${token.metadata.attributes[1].value} ${token.metadata.attributes[1].trait_type}`}
            </div> 
            { token.tokenised ? 
              <div className="text-center text-sm text-gray-500"> 
                {`${Number(token.availableTokens)} vouchers remaining`}
              </div>
              :
              null
            }
          </div> 
        </>
          : 
          <div> loading </div>
      }
      </button>
  );
}