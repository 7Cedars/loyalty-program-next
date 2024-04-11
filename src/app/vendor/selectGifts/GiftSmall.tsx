"use client"; 
import { LoyaltyGift } from "@/types";
import Image from "next/image";

type SelectedGiftProps = {
  gift: LoyaltyGift; 
  disabled: boolean;
  onClick: () => void;
}

export default function GiftSmall( {gift, disabled, onClick}: SelectedGiftProps ) {
  let appearance = `h-72 w-40 m-2 grid grid-cols-1 border rounded-lg border-gray-700 dark:border-gray-200 ${ disabled ? 'opacity-50' : null} `

  return (
     
      <button className={appearance} onClick={onClick}> 
      {gift.metadata ? 
        <>
          <Image
              className="rounded-t-lg"
              width={160}
              height={160}
              src={gift.metadata.imageUri}
              alt="Loyalty Gift icon "
            />
          <div className="grid grid-cols-1 p-2 content-start">
            <div className="text-center text-sm"> 
              {gift.metadata.name}
            </div>
            { gift.isClaimable == 1n ? 
              <div className="text-center text-sm text-gray-500 mt-1"> 
                {`${gift.cost} points`}
              </div> 
              :
              <div className="text-center text-sm text-gray-500"> 
                {`Cannot be exchanged for points.`}
              </div>
            }            
            { gift.isVoucher == 1n? 
              <div className="text-center text-sm text-gray-500"> 
                {`${Number(gift.availableVouchers)} vouchers left`}
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