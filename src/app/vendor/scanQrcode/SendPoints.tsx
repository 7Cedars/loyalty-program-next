import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { QrData } from "@/types";
import { Button } from "@/app/ui/Button";
import Image from "next/image";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { NumPad } from "@/app/ui/NumPad";
import { useWriteContract, useWaitForTransactionReceipt  } from "wagmi";
import { useDispatch } from "react-redux";
import { parseEthAddress } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi";
import { notification } from "@/redux/reducers/notificationReducer";
import { useAccount } from "wagmi";
import { useAppSelector } from "@/redux/hooks";

type SendPointsProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}

export default function SendPoints({qrData, setData}: SendPointsProps)  {
  const [numpadNumber, setNumpadNumber] = useState<number>(0)
  const [hashTransaction, setHashTransaction] = useState<`0x${string}`>() 
  const dispatch = useDispatch() 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { address } = useAccount()
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
        id: "transferPoints",
        message: `Success. ${numpadNumber} points sent.`, 
        colour: "green",
        isVisible: true
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitForTransaction.isSuccess, waitForTransaction.status ])

  useEffect(() => {
    if (isError) {
      dispatch(notification({
        id: "transferPoints",
        message: `Something went wrong. Loyalty points not sent.`, 
        colour: "red",
        isVisible: true
      }))
    }
  }, [isError])

  useEffect(() => {
    if (isSuccess)  setHashTransaction(data)
  }, [isSuccess])

  return (
    <div className="flex flex-col justify-between justify-center pt-2 h-full">

      <TitleText title = "Send Loyalty Points" subtitle="Send loyalty points to a customer." size = {2} />

      {qrData?.loyaltyCardAddress? 
  
      <div className="grid grid-cols-1 p-2 w-full text-center justify-items-center"> 
          <p>
            Points requested by card: 
          </p>
          <p className="w-1/2 border-b border-blue-500 pb-2">
            {qrData.loyaltyCardAddress.slice(0,9)}...{qrData.loyaltyCardAddress.slice(35,42)}
          </p>
      </div>
      : null}

      <p className="text-2xl text-center p-3">
        {`${numpadNumber} points`}
      </p>
      <div className="grid grid-cols-1 justify-items-center"> 
        <NumPad onChange={(number: number) => setNumpadNumber(number) } /> 
    
        <div className="w-72 mt-3 flex justify-center"> 

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
              Waiting for confirmation... 
            </div>
          </Button>
          : 
          <Button appearance = {"blueFilled"} onClick={() => writeContract({ 
              abi: loyaltyProgramAbi,
              address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
              functionName: 'safeTransferFrom',
              args: [ 
                parseEthAddress(address), 
                parseEthAddress(qrData?.loyaltyCardAddress), 
                0, 
                numpadNumber, 
                ""],
            })} >
            Transfer Points
          </Button>
        }
        
        </div>
      </div>
      <div className="flex md:px-48 px-6">
        <Button onClick={() => {setData(undefined)}}>
            Back to QR reader
        </Button>
      </div>
      <div className="pb-16"/>
    </div>
    
  )
} 