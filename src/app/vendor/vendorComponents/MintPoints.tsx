"use client";

import { NumPad } from "@/app/ui/NumPad";
import { useState, useEffect } from "react";
import { Button } from "@/app/ui/Button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { parseEthAddress } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { useVendorAccount } from "@/app/hooks/useVendorAccount";

export default function MintPoints() {
  const [numpadNumber, setNumpadNumber] = useState<number>(0)
  const [hashTransaction, setHashTransaction] = useState<`0x${string}`>() 
  const dispatch = useDispatch() 
  const {refetchBalances} = useVendorAccount()
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { writeContract, isError, isSuccess, data } = useWriteContract()

  const waitForTransaction = useWaitForTransactionReceipt(
    { 
      confirmations: 1,
      hash: hashTransaction,
      // timeout: 30_000,
    }
  ) 

  useEffect(() => { 
    if (waitForTransaction.isSuccess) {
      dispatch(notification({
        id: "mintLoyaltyPoints",
        message: `Success. ${numpadNumber} points minted.`, 
        colour: "green",
        isVisible: true
      }))
      refetchBalances() 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitForTransaction.isSuccess, waitForTransaction.status ])

  useEffect(() => {
    if (isError) {
      dispatch(notification({
        id: "mintLoyaltyPoints",
          message: `Something went wrong. Loyalty Points not minted.`, 
          colour: "red",
          isVisible: true
      }))
    }
  }, [isError])

  useEffect(() => {
    if (isSuccess)  setHashTransaction(data)
  }, [isSuccess])

  return (
    <div className="p-3 grid grid-cols-1 justify-items-center"> 
      <p className="text-2xl text-center p-3">
        {`${numpadNumber} points`}
      </p>
      <div className="max-w-xl"> 
        <NumPad onChange={(number: number) => setNumpadNumber(number) } /> 
   
        <div className="flex mt-3"> 

        { waitForTransaction.isLoading ? 
        
          <Button appearance = {"grayEmpty"} onClick={() => {}} >
            <div className="flex justify-center items-center">
              <Image
                className="rounded-lg opacity-25 flex-none mx-3 animate-spin"
                width={30}
                height={30}
                src={"/images/loading2.svg"}
                alt="Loading icon"
              />
              Waiting for confirmation..
            </div>
          </Button>
          : 
          <Button appearance = {"grayFilled"} onClick={() => writeContract({ 
            abi: loyaltyProgramAbi,
            address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
            functionName: 'mintLoyaltyPoints',
            args: [numpadNumber]
         })} >
            Mint Points
          </Button>
        }
        
        </div>
      </div>
    </div>      
  );
}