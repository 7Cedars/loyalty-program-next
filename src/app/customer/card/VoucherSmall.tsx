"use client"; 
import { LoyaltyGift } from "@/types";
import Image from "next/image";

type SelectedTokenProps = {
  token: LoyaltyGift; 
  disabled: boolean;
  onClick: () => void;
}

export default function VoucherSmall( {token, disabled, onClick}: SelectedTokenProps ) {
  let appearance = `h-64 w-40 m-2 grid grid-cols-1 border rounded-lg border-gray-400`

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
            <div className="text-center text-sm text-gray-500"> 
              {`Gift Id: ${Number(token.giftId)}`}
            </div>
          </div> 
        </>
          : 
          <div> loading </div>
      }
      </button>
  );
}