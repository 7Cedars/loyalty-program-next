"use client"; 
import { EthAddress, LoyaltyGift } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { parseEthAddress } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { TitleText } from "@/app/ui/StandardisedFonts";

type SelectedGiftProps = {
  loyaltyCardAddress: EthAddress; 
  gift: LoyaltyGift;
  transferVoucher: () => void;
}

export default function GiftBig({gift, loyaltyCardAddress, transferVoucher}: SelectedGiftProps ) {
  const dimensions = useScreenDimensions();
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const dispatch = useDispatch() 

  const { isLoading, isSuccess, isError }  = useWaitForTransactionReceipt(
    { 
      confirmations: 1,
      hash: hashTransaction 
    })
  
  return (
    <div className="grid grid-cols-1 border rounded-lg border-slate-800 dark:border-slate-200 m-2 p-2"> 
      <TitleText title = "Transfer voucher" subtitle="Send a voucher to customer for free, skipping any requirements or transfer of points." size={1} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center "> 
      { gift && gift.metadata
        ? 
        <>
        
        <div className="rounded-lg w-max pt-2"> 
          <Image
              className="rounded-lg"
              width={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
              height={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
              src={gift.metadata.imageUri}
              alt="Loyalty Token icon "
            />
        </div>
        
        <div className="grid grid-cols-1 pt-2 content-between w-4/5 h-full">
          <div> 
            <div className="text-center text-lg text-slate-800 dark:text-slate-200 text-bold px-1"> 
              {gift.metadata.name}
            </div>
            <div className="text-center text-lg text-slate-500 pb-4"> 
              {gift.metadata.description}
            </div>
              {gift.isClaimable == 1 ? 
                <div className="text-center text-lg"> 
                  {`Cost: ${gift.cost} points`}
                </div> 
                :
                null
              }
              {gift.hasAdditionalRequirements == 1 ? 
                <div className="text-center text-lg"> 
                  {`Additional requirements: ${gift.metadata.attributes[0].value}`}
                </div> 
                :
                null
              }
            <div className="text-center text-lg text-slate-500 break-words pt-4"> 
              Gift address: {gift.giftAddress}
            </div>
            <div className="text-center text-lg text-slate-500 pb-4"> 
              Gift Id: {gift.giftId}
            </div>
          </div>
          {gift.isVoucher == 1 ? 
            <div className="text-center text-lg"> 
              {`${gift.availableVouchers} remaining vouchers.`}
            </div>
            :
            null
          }
        </div>
        </>
        : 
        null
      }
      </div>
      
      <div className="p-3 flex m-1"> 
      { isLoading ? 
          <Button appearance = {"grayEmpty"} disabled >
            <div className="flex justify-center items-center">
              <Image
                className="rounded-lg opacity-25 flex-none mx-3 animate-spin"
                width={30}
                height={30}
                src={"/images/loading2.svg"}
                alt="Loading icon"
              />
              Waiting for confirmation (this can take a few minutes...)
            </div>
          </Button>
        : 
        isSuccess ?
          <Button appearance = {"grayEmpty"} disabled >
            <div className="flex justify-center items-center">
              <Image
                className="rounded-lg opacity-25 flex-none mx-3 animate-spin"
                width={30}
                height={30}
                src={"/images/loading2.svg"}
                alt="Loading icon"
              />
              Voucher succesfully transferred.  
            </div>
          </Button>
        : 
          <Button appearance = {"greenEmpty"} onClick={() => transferVoucher() } >
              Transfer voucher
          </Button>
        } 
        </div> 
      </div>
  )
}