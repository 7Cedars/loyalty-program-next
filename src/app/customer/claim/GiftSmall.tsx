"use client"; 
import { LoyaltyGift } from "@/types";
import Image from "next/image";

type SelectedTokenProps = {
  gift: LoyaltyGift; 
  disabled: boolean;
  onClick: () => void;
}

export default function GiftSmall( {gift, disabled, onClick}: SelectedTokenProps ) {
  let appearance = `h-72 w-40 m-2 grid grid-cols-1 border rounded-lg border-slate-800 dark:border-slate-200 ${ disabled ? 'opacity-50' : null} `

  return (
     
      <button className={appearance} onClick={onClick}> 
       {gift.metadata ? 
        <>
          <Image
              className="rounded-t-lg"
              width={160}
              height={160}
              src={gift.metadata.imageUri}
              alt="Loyalty Token icon"
            />
          <div className="grid grid-cols-1 p-2 content-start">
            <div className="text-center text-sm"> 
              {gift.metadata.name}
            </div>
            <div className="text-center text-sm text-gray-500 mt-1"> 
              {`${gift.cost} points`}
            </div> 
            { gift.isVoucher == 1n ? 
              <div className="text-center text-sm text-gray-500"> 
                {`${Number(gift.availableVouchers)} vouchers remaining`}
              </div>
              :
              <div className="text-center text-sm text-gray-500"> 
               text here
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