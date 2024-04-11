"use client"; 
import { LoyaltyGift } from "@/types";
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

type SelectedGiftProps = {
  selectedGift: LoyaltyGift;
  disabled: boolean;
  // updateGift: () => void;
}

export default function GiftBig({selectedGift, disabled}: SelectedGiftProps ) {
  const dimensions = useScreenDimensions();
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const [ hashMintTransaction, setHashMintTransaction] = useState<any>()
  const [ isDisabled, setIsDisabled ] = useState<boolean>(disabled) 
  const dispatch = useDispatch() 
  const { writeContract, isSuccess: isSuccessWriteContract, isError: isErrorWriteContract, data: writeContractData } = useWriteContract()
  const { writeContract: mintVouchers, isSuccess: isSuccessMintVouchers, data: mintVoucherData } = useWriteContract()

  // const executeExternalUpdate= () => {
  //   if(typeof updateGift === 'function'){
  //     updateGift()
  //   }    
  // }

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

  // useEffect(() => { 
  //   if (isSuccessMint) {
  //     executeExternalUpdate() 
  //   }
  // }, [isSuccessMint])
  
  return (
    <div className="grid grid-cols-1"> 

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center "> 
      { selectedGift.metadata
        ? 
        <>
        <div className="rounded-lg w-max"> 
          <Image
              className="rounded-lg"
              width={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
              height={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
              src={selectedGift.metadata.imageUri}
              alt="Loyalty Token icon "
            />
        </div>
        
        <div className="grid grid-cols-1 pt-2 content-between w-4/5 h-full">
          <div> 
            <div className="text-center text-lg text-slate-800 dark:text-slate-200 text-bold px-1"> 
              {selectedGift.metadata.name}
            </div>
            <div className="text-center text-lg text-slate-500 pb-4"> 
              {selectedGift.metadata.description}
            </div>
              {selectedGift.isClaimable == 1n ? 
                <div className="text-center text-lg"> 
                  {`Cost: ${selectedGift.cost} points`}
                </div> 
                :
                null
              }
              {selectedGift.hasAdditionalRequirements == 1n ? 
                <div className="text-center text-lg pb-4"> 
                  {`Additional requirements: ${selectedGift.metadata.attributes[2].value}`}
                </div> 
                :
                null
              }
          </div>
          {selectedGift.isVoucher == 1n ? 
            <div className="text-center text-lg"> 
              {`${selectedGift.availableVouchers} remaining vouchers.`}
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
          { selectedGift.isVoucher == 1n ? 
            <div className="p-3 flex w-full"> 
              <NumLine onClick = {(arg0) => mintVouchers({
                abi: loyaltyProgramAbi,
                address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
                functionName: "mintLoyaltyVouchers",
                args: [selectedGift.giftAddress, [selectedGift.giftId], [arg0]]}
                )} 
                isLoading = {isLoadingMint} /> 
            </div>
            : null
          }
          { isDisabled ? 
            <div className="p-3 flex "> 
              <Button appearance = {"greenEmpty"} onClick={() => writeContract({ 
                  abi: loyaltyProgramAbi,
                  address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
                  functionName: "addLoyaltyGift", 
                  args: [selectedGift.giftAddress, selectedGift.giftId]
                })} >
                  Add Loyalty Gift
              </Button>
            </div> 
            : 
            <div className="p-3 flex "> 
              <Button appearance = {"redEmpty"} onClick={() => writeContract({ 
                  abi: loyaltyProgramAbi,
                  address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
                  functionName: "removeLoyaltyGiftClaimable", 
                  args: [selectedGift.giftAddress, selectedGift.giftId]
                })
              } >
                Remove Loyalty Gift
              </Button>
            </div>
        } 
      </div> 
    }
  </div> 
  )
}