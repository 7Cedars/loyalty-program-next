"use client"; 

import QRCode from "react-qr-code";
import { useAppSelector } from '@/redux/hooks';
import { LoyaltyGift } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { Button } from "@/app/ui/Button";
import { useAccount, usePublicClient, useSignTypedData } from "wagmi";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { parseBigInt, parseEthAddress } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi";
import { notification } from "@/redux/reducers/notificationReducer";
import { useLatestCustomerTransaction } from "@/app/hooks/useLatestTransaction";
import { RootState } from "@/redux/store";

type SelectedTokenProps = {
  gift: LoyaltyGift
  disabled: boolean
}

export default function RedeemToken( {gift, disabled}: SelectedTokenProps)  {
  const { selectedLoyaltyCard } = useAppSelector((state: RootState) => state.selectedLoyaltyCard )
  const dimensions = useScreenDimensions();
  const { selectedLoyaltyProgram  } = useAppSelector((state: RootState) => state.selectedLoyaltyProgram )
  const publicClient = usePublicClient()
  const [ nonceData, setNonceData ] = useState<BigInt>()
  const [ isDisabled, setIsDisabled ] = useState<boolean>(disabled) 
  const dispatch = useDispatch() 
  const {address, chain} = useAccount()
  const { data: signature, isPending, isError, isSuccess, signTypedData, reset } = useSignTypedData()

  const  polling = useRef<boolean>(false) 
  const {  pointsSent, tokenSent } = useLatestCustomerTransaction(polling.current) 

  useEffect(() => {
    const getNonceLoyaltyCard = async () => {
      if (publicClient)
      try {
        const rawNonceData: unknown = await publicClient.readContract({ 
          address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'getNonceLoyaltyCard',
          args: [selectedLoyaltyCard?.cardAddress]
        })
        const nonceData = parseBigInt(rawNonceData); 
        setNonceData(nonceData)
        } catch (error) {
          console.log(error)
        }
      }

    if(!nonceData) { getNonceLoyaltyCard() } 
  }, [nonceData] ) 

  /// begin setup for encoding typed data /// 
  // depricated? 
  const domain = {
    name: selectedLoyaltyProgram?.metadata?.name,
    version: 'alpha.2',
    chainId: chain?.id,
    verifyingContract: parseEthAddress(selectedLoyaltyProgram?.programAddress)
  } as const

  // The named list of all type definitions
  const types = {
    RedeemVoucher: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'voucher', type: 'string' },
      { name: 'nonce', type: 'uint256' },
    ],
  } as const

  // // The message that will be hashed and signed
  const message = {
    from: parseEthAddress(selectedLoyaltyCard?.cardAddress),
    to:  parseEthAddress(selectedLoyaltyProgram?.programAddress),
    voucher: `${gift?.metadata?.name}`,
    nonce: nonceData ? parseBigInt(nonceData) : 0n,
  } as const

  useEffect(() => { 
    if (signature) {
      dispatch(notification({
        id: "redeemToken",
        message: `Let vendor scan this Qrcode to receive your gift.`, 
        colour: "yellow",
        isVisible: true
      }))
    }
  }, [signature])

  useEffect(() => { 
    if (isError) {
      polling.current = false  
      dispatch(notification({
        id: "qrCodeAuthentication",
        message: `Something went wrong. Qrcode not created.`, 
        colour: "red",
        isVisible: true
      }))
    }
  }, [isSuccess, isError, isPending])

  useEffect(() => {
    if (tokenSent) {
      reset() 
      polling.current = false  
      dispatch(notification({
        id: "redeemToken",
        message: `Your voucher has been succesfully received.`, 
        colour: "green",
        isVisible: true
      }))
    }
  }, [tokenSent])


  return (
    <div className="grid grid-cols-1"> 

      { gift.metadata && !signature ? 
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full justify-items-center "> 
          <div className="rounded-lg w-max"> 
          
            <Image
                className="rounded-lg"
                width={dimensions.width < 896 ?  Math.min(dimensions.height, dimensions.width) * .35  : 400}
                height={dimensions.width < 896 ?  Math.min(dimensions.height, dimensions.width) * .35 : 400}
                src={gift.metadata.imageUri}
                alt="Loyalty Token icon "
              />
          </div>
          
          <div className="grid grid-cols-1 pt-2 content-between w-full h-full">
            <div> 
              <TitleText title={gift.metadata.name} subtitle={gift.metadata.description} size={1} />
            </div>
            {tokenSent ? 
              <p className="text-center text-xl font-bold p-8">
                {gift.metadata?.attributes[6].value}
              </p>
            :
            null
            }
            <div className="text-center text-md"> 
              <div className="text-center text-md"> 
                {`ID: ${gift.giftId} @${gift.giftAddress.slice(0,6)}...${gift.giftAddress.slice(36,42)}`}
              </div>
              {gift.isVoucher == 1 ? 
                <div className="text-center text-md"> 
                  {`Remaining vouchers: ${gift.availableVouchers}`}
                </div>
                :
                null
              }
            </div>
          </div>
        </div>
        <div className="p-3 flex w-full"> 
            <Button appearance = {"greenEmpty"} onClick={() => signTypedData({
                domain, 
                types, 
                primaryType: 'RedeemVoucher',
                message
              })} >
              Sign message to redeem voucher
            </Button>
          </div>
        </>
        : null
        }
        
        { gift.metadata && signature ?
          <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 flex flex-col items-center"> 
            {/* <TitleText title = "" subtitle = "Let vendor scan this Qrcode to receive your gift" size={1} /> */}
            <div className="m-3 flex items-center"> 
              <QRCode 
                value={`type:redeemToken;${gift.giftAddress};${gift.giftId};${selectedLoyaltyCard?.cardId};${address};${signature}`}
                style={{ 
                  height: "350px", 
                  width: "350px", 
                  objectFit: "cover", 
                  background: 'white', 
                  padding: '16px', 
                }}
                bgColor="#ffffff" // "#0f172a" 1e293b
                fgColor="#000000" // "#e2e8f0"
                level='L'
                className="rounded-lg"
                />
            </div>
          </div>
        : 
        null 
        }
    </div>
  )
}


    // <>
    // <div className="flex flex-col justify-between pt-2 h-full">
    //   <div className="grow"> 
    //     <div className="grid justify-center justify-items-center p-6">
    //         <QRCode 
    //           value={`type:redeemToken;lp:${selectedLoyaltyProgram?.programAddress};lc:${selectedLoyaltyCard?.cardAddress};lt:${gift.giftAddress};ti:${gift.giftId};sg:${signature}`}
    //           style={{ height: "400px", width: "350px", objectFit: "cover"  }}
    //           />
    //     </div>
    //     </div>
    //   </div>
    //   <div className="h-16"/> 
    // </>

