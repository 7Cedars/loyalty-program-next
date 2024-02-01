"use client";

import { Dispatch, SetStateAction } from "react";
import { NumPad } from "@/app/ui/NumPad";
import { useState, useEffect } from "react";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useWaitForTransaction, useContractEvent } from "wagmi";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { parseEthAddress } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import Image from "next/image";

type RedeemTokenProps = {
  modal: 'points' | 'cards' | undefined;  
  setModal: Dispatch<SetStateAction<'points' | 'cards' | undefined>>; 
}

export default function MintCards( {modal, setModal}: RedeemTokenProps ) {
  const [numpadNumber, setNumpadNumber] = useState<number>(0)
  const [hashTransaction, setHashTransaction] = useState<`0x${string}`>() 
  const dispatch = useDispatch() 
  const { progAddress } =  useUrlProgramAddress();

  const mintCards = useContractWrite(  
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: 'mintLoyaltyCards',
      args: [numpadNumber], 
      onError(error) {
        dispatch(notification({
          id: "mintLoyaltyCards",
          message: `Something went wrong. Loyalty crads not minted.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('mintLoyaltyCards Error', error)
      }, 
      onSuccess(data) {
        setHashTransaction(data.hash)
      }
    }, 
  )

  // NB: use of useContractEvent versus waitForTransaction to check confirmaiton of transaction
  // has to be tried out on actual test network. Not anvil. 
  /// 
  // useContractEvent({
  //   address: parseEthAddress(progAddress),
  //   abi: loyaltyProgramAbi,
  //   eventName: 'TransferSingle',
  //   listener(log) {
  //     console.log("TransferSingle log:", log)
  //   },
  // })

  const waitForTransaction = useWaitForTransaction(
    { 
      confirmations: 1,
      hash: hashTransaction,
      // timeout: 30_000,
    }
  ) 

  useEffect(() => { 
    if (waitForTransaction.isSuccess) {
      dispatch(notification({
        id: "mintLoyaltyCards",
        message: `Success. ${numpadNumber} cards minted.`, 
        colour: "green",
        isVisible: true
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitForTransaction.isSuccess ])

  
  const handleChange = (number: number) => {
    setNumpadNumber(number)
    console.log("NUMPAD number: ", number)
  }

  return (
    <div className="p-3 px-12 pt-12 grid grid-cols-1 justify-items-center"> 
      <p className="text-2xl text-center p-3">
        {`${numpadNumber} cards`}
      </p>
      <div className="max-w-xl"> 
        <NumPad onChange={(number: number) => handleChange(number) } /> 
   
        <div className="flex mt-3"> 

        { waitForTransaction.isLoading ? 
        
          <Button appearance = {"grayEmpty"} onClick={() => {}} >
            <div className="flex justify-center items-center">
              <Image
                className="rounded-lg opacity-25 flex-none mx-3 animate-spin"
                width={30}
                height={30}
                src={"/loading.svg"}
                alt="Loading icon"
              />
              Waiting for confirmation..
            </div>
          </Button>
          : 
          <Button appearance = {"blueFilled"} disabled={!mintCards.write} onClick={() => mintCards.write?.()}>
            Mint Cards
          </Button>
        }
        
        </div>
      </div>
    </div>      
  );
}