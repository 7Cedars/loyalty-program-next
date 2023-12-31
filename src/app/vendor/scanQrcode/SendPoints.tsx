// TODO 

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { QrData } from "@/types";
import { Button } from "@/app/ui/Button";
import Image from "next/image";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { NumPad } from "@/app/ui/NumPad";
import { useContractWrite, useWaitForTransaction  } from "wagmi";
import { useDispatch } from "react-redux";
import { parseEthAddress } from "@/app/utils/parsers";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi } from "@/context/abi";
import { notification } from "@/redux/reducers/notificationReducer";
import { useAccount } from "wagmi";

type SendPointsProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}
// use Setdata to reset qrdata when action is completed. 

export default function SendPoints({qrData, setData}: SendPointsProps)  {
  const [numpadNumber, setNumpadNumber] = useState<number>(0)
  const [hashTransaction, setHashTransaction] = useState<`0x${string}`>() 
  const dispatch = useDispatch() 
  const { progAddress } =  useUrlProgramAddress();
  const { address } = useAccount() 

  const transferPoints = useContractWrite(  
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: 'safeTransferFrom',
      args: [ address, qrData?.loyaltyCardAddress, 0, numpadNumber, ""], 
      onError(error) {
        dispatch(notification({
          id: "transferPoints",
          message: `Something went wrong. Loyalty points not sent.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('transferPoints Error', error)
      }, 
      onSuccess(data) {
        setHashTransaction(data.hash)
      }
    }, 
  )

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
        id: "transferPoints",
        message: `Success. ${numpadNumber} points sent.`, 
        colour: "green",
        isVisible: true
      }))
    }
    if (waitForTransaction.status) {
      console.log("data waitForTransaction: ", waitForTransaction.status)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitForTransaction.isSuccess, waitForTransaction.status ])


  const handleChange = (number: number) => {
    setNumpadNumber(number)
    console.log("NUMPAD number: ", number)
  }

  return (
    <div className="grid grid-cols-1 justify-items-center h-full content-between">

    <TitleText title = "Send Loyalty Points" subtitle="Send loyalty points to a customer." size = {2} />

    {qrData?.loyaltyCardAddress? 
    <div className="grid grid-cols-1 w-1/2 p-2 pt-6 text-center justify-items-center border-b border-blue-800"> 
        <p>
           Points requested by card: 
        </p>
        <p>
          {qrData.loyaltyCardAddress.slice(0,9)}...{qrData.loyaltyCardAddress.slice(35,42)}
        </p>
    </div>
    : null}

    <p className="text-2xl text-center p-3">
        {`${numpadNumber} points`}
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
              Waiting for confirmation (this can take a few minutes...)
            </div>
          </Button>
          : 
          <Button appearance = {"blueFilled"} isDisabled={!transferPoints.write} onClick={() => transferPoints.write?.()}>
            Transfer Points
          </Button>
        }
        
        </div>
      </div>
      <div className="p-3 px-12 pb-14 flex grow">
        <Button onClick={() => {setData(undefined)}}>
          <div className="flex justify-center items-center">
            Back to QR reader
          </div>
        </Button>
      </div>
    </div>
    
  )
} 