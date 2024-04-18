import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { LoyaltyGift, QrData } from "@/types";
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
import { useLoyaltyGifts } from "@/app/hooks/useLoyaltyGifts";
import { GiftSmall } from "@/app/components/GiftSmall";
import GiftBig from "./GiftBig";

type SendPointsOrVoucherProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}

export default function SendPoints({qrData, setData}: SendPointsOrVoucherProps)  {
  const { loyaltyGifts, fetchGifts  } = useLoyaltyGifts() 
  const [numpadNumber, setNumpadNumber] = useState<number>(0)
  const [selectedVoucher, setSelectedVoucher] = useState<LoyaltyGift>()
  const [hashTransaction, setHashTransaction] = useState<`0x${string}`>() 
  const [hashVoucherTransferTransaction, setHashVoucherTransferTransaction] = useState<`0x${string}`>() 
  const dispatch = useDispatch() 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { address } = useAccount()
  const { writeContract, isError, isSuccess, data, error } = useWriteContract()
  const { 
    writeContract: writeTransferVoucher, 
    isError: isErrorTransferVoucher, 
    isSuccess: isSuccessTransferVoucher, 
    data: dataTransferVoucher, 
    error: errorTransferVoucher 
  } = useWriteContract()

  useEffect(() => {
    !loyaltyGifts ? fetchGifts() : null  
  }, [loyaltyGifts])

  // data flow transfer points
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
      console.log(error)
    }
  }, [isError])

  useEffect(() => {
    if (isSuccess)  setHashTransaction(data)
  }, [isSuccess])

  // data flow transfer voucher
  useEffect(() => {
    if (isSuccessTransferVoucher)  setHashVoucherTransferTransaction(dataTransferVoucher)
  }, [isSuccessTransferVoucher])

   const waitForVoucherTransferTransaction = useWaitForTransactionReceipt(
    { 
      confirmations: 1,
      hash: hashVoucherTransferTransaction,
      // timeout: 30_000,
    }
  ) 

  useEffect(() => { 
    if (waitForVoucherTransferTransaction.isSuccess) {
      dispatch(notification({
        id: "transferVoucher",
        message: `Success. Voucher sent.`, 
        colour: "green",
        isVisible: true
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitForVoucherTransferTransaction.isSuccess, waitForVoucherTransferTransaction.status ])

  useEffect(() => {
    if (isErrorTransferVoucher) {
      dispatch(notification({
        id: "transferVoucher",
        message: `Something went wrong. Voucher not sent.`, 
        colour: "red",
        isVisible: true
      }))
      console.log(errorTransferVoucher)
    }
  }, [isErrorTransferVoucher])

  return (
    <div className="flex flex-col justify-between justify-center pt-2 h-full w-full">
      <TitleText title = "Send Points or Voucher" size = {2} />

      { selectedVoucher && qrData?.loyaltyCardAddress ? 
        <GiftBig loyaltyCardAddress = {qrData?.loyaltyCardAddress } gift = {selectedVoucher} transferVoucher={() => {
          writeTransferVoucher({ 
                abi: loyaltyProgramAbi,
                address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
                functionName: "transferLoyaltyVoucher", 
                args: [
                  selectedLoyaltyProgram?.programOwner, 
                  qrData?.loyaltyCardAddress, 
                  selectedVoucher.giftId, 
                  selectedVoucher.giftAddress
                ]
              })}
        } /> 
      :
      <>

        <div className="w-full flex justify-center p-4"> 
          <div className="w-1/2 border-t border-slate-800 dark:border-slate-200" /> 
        </div>
        <TitleText title = "Send Loyalty Points" subtitle="Send loyalty points to a customer" size = {1} />

        {qrData?.loyaltyCardAddress? 
    
        <div className="grid grid-cols-1 w-full text-center justify-items-center"> 
            <p>
              Points requested by card: 
            </p>
            <p className="w-1/2 pb-2">
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
            <Button appearance = {"blueEmpty"} onClick={() => writeContract({ 
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

        <div className="w-full flex justify-center p-4"> 
          <div className="w-1/2 border-t border-slate-800 dark:border-slate-200" /> 
        </div>

        {loyaltyGifts ? 
          <div className="w-full flex flex-col"> 
            <TitleText title = "Transfer Voucher" subtitle="Send a voucher to customer for free." size={1} />

            { loyaltyGifts.find(gift => gift.availableVouchers &&  gift.availableVouchers > 0) != undefined ?
                
                <div className="flex flex-row overflow-x-auto"> 
                  {loyaltyGifts.map((gift: LoyaltyGift) => {
                    return (
                      gift.availableVouchers && gift.availableVouchers > 0 ? 
                        <div key = {`${gift.giftAddress}:${gift.giftId}`} >
                          <GiftSmall gift = {gift} disabled = {false} onClick={() => setSelectedVoucher(gift)}  /> 
                        </div>
                        : 
                        null
                    )
                  })}
                </div> 
              : 
              <div className="text-sm text-center text-gray-500 italic p-2">
                No gift vouchers have been minted yet. See the gifts tab.   
              </div>
            }
          </div>
          :
          null 
        }
      </>
      }
      
      <div className="flex md:px-48 px-6 pt-4">
        <Button onClick={() => {setData(undefined)}}>
            Back to QR reader
        </Button>
      </div>
      <div className="pb-16"/>
    </div>
    
  )
} 