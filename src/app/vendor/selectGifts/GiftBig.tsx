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
import { NumLine } from "@/app/ui/NumLine";
import { useAppSelector } from "@/redux/hooks";
import { useLoyaltyGifts } from "@/app/hooks/useLoyaltyGifts";

type SelectedGift = {
  address: EthAddress; 
  id: number; 
} 

type SelectedGiftProps = {
  allGifts: LoyaltyGift[]; 
  selectedGift: SelectedGift;
  disabled: boolean;
  updateGift: () => void;
}

export default function GiftBig({allGifts, selectedGift, disabled, updateGift}: SelectedGiftProps ) {
  const dimensions = useScreenDimensions();
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const [ hashMintTransaction, setHashMintTransaction] = useState<any>()
  const [ isDisabled, setIsDisabled ] = useState<boolean>(disabled) 
  const dispatch = useDispatch() 
  const { writeContract, isSuccess: isSuccessWriteContract, isError: isErrorWriteContract, data: writeContractData } = useWriteContract()
  const { writeContract: mintVouchers, isSuccess: isSuccessMintVouchers, data: mintVoucherData } = useWriteContract()

  const executeExternalUpdate= () => {
    if(typeof updateGift === 'function'){
      updateGift()
    }    
  }

  const gift = allGifts.find(gift => gift.giftAddress == selectedGift.address && gift.giftId == selectedGift.id)

  // selecting gift flow
  useEffect(() => {
    if (isErrorWriteContract) {
      dispatch(notification({
        id: "loyaltyGift",
        message: `Something went wrong. That's all I know.`, 
        colour: "red",
        isVisible: true
      }))
    }
  }, [isErrorWriteContract])

  useEffect(() => {
    if (isSuccessWriteContract) setHashTransaction(writeContractData)
  }, [isSuccessWriteContract])

  const { data, isError, isLoading, isSuccess } = useWaitForTransactionReceipt(
    { 
      confirmations: 1,
      hash: hashTransaction 
    })

  useEffect(() => { 
    if (isSuccess) {
      setIsDisabled(!isDisabled)
    }
  }, [isSuccess])

  // minting vouchers flow
  useEffect(() => {
    if (isSuccessMintVouchers) setHashMintTransaction(mintVoucherData)
  }, [isSuccessMintVouchers])

  const { isLoading: isLoadingMint, isSuccess: isSuccessMint }  = useWaitForTransactionReceipt(
    { 
      confirmations: 1,
      hash: hashMintTransaction 
    })

  useEffect(() => { 
    if (isSuccessMint) {
      executeExternalUpdate() 
    }
  }, [isSuccessMint])
  
  return (
    <div className="grid grid-cols-1"> 

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center "> 
      { gift && gift.metadata
        ? 
        <>
        <div className="rounded-lg w-max"> 
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

      { isLoading ? 
        <div className="p-3 flex "> 
          <Button appearance = {"grayEmpty"} onClick={() => {}} >
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
        </div> 
        :
        <div className="grid grid-col-1 gap-0 w-full">
          { gift && gift.isVoucher == 1 ? 
            <div className="px-3 flex w-full"> 
              <NumLine onClick = {(arg0) => mintVouchers({
                abi: loyaltyProgramAbi,
                address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
                functionName: "mintLoyaltyVouchers",
                args: [gift.giftAddress, [gift.giftId], [arg0]]}
                )} 
                isLoading = {isLoadingMint} /> 
            </div>
            : null
          }
          { gift && isDisabled && gift.isClaimable == 1 ? 
            <div className="px-3 pt-6 flex "> 
              <Button appearance = {"greenEmpty"} onClick={() => writeContract({ 
                  abi: loyaltyProgramAbi,
                  address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
                  functionName: "addLoyaltyGift", 
                  args: [gift.giftAddress, gift.giftId]
                })} >
                  Allow Customer to Claim Gift 
              </Button>
            </div> 
            : 
            gift && gift.isClaimable == 1 ? 
            <div className="px-3 flex "> 
              <Button appearance = {"redEmpty"} onClick={() => writeContract({ 
                  abi: loyaltyProgramAbi,
                  address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
                  functionName: "removeLoyaltyGiftClaimable", 
                  args: [gift.giftAddress, gift.giftId]
                })
              } >
                Disallow Customer to Claim Gift
              </Button>
            </div>
            : 
            null 
          } 
          {/* has to be conditional on isVoucher? and availableVouchers > 0 */}
          {/* <div className="px-3 flex "> 
            <Button appearance = {"blueEmpty"} >
                Transfer gift
            </Button>
           </div>  */}
      </div> 
    }
  </div> 
  )
}