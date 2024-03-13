"use client"; 

// See for eip-712 example https://medium.com/coinmonks/eip-712-example-d5877a1600bd 
import { LoyaltyGift } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useWaitForTransaction, useAccount, usePublicClient } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { parseEthAddress, parseNumber } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { QrData } from "@/types";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLoyaltyGifts } from "@/app/hooks/useLoyaltyGifts";
import { useAppSelector } from "@/redux/hooks";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useLatestVendorTransaction } from "@/app/hooks/useLatestTransaction";

type SendPointsProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}

export default function ClaimGift( {qrData, setData}: SendPointsProps ) {
  const dimensions = useScreenDimensions();
  const { status, loyaltyGifts, fetchGifts } = useLoyaltyGifts()
  const [token, setToken] = useState<LoyaltyGift>()
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const dispatch = useDispatch() 
  const { pointsReceived } = useLatestVendorTransaction(true) 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )

  console.log("QRDATA @claim gift: ", qrData)
  console.log("loyaltyGifts @claim gift: ", loyaltyGifts)

  useEffect(() => {
    if (!loyaltyGifts && qrData) {
            
          fetchGifts([{
            giftAddress: parseEthAddress(qrData?.loyaltyToken), 
            giftId: parseNumber(qrData?.loyaltyTokenId) 
          }])
    }
    if (status == "isSuccess" && loyaltyGifts) setToken(loyaltyGifts[0])
  }, [, qrData])

  useEffect(() => {
    if (status == "isSuccess" && loyaltyGifts) setToken(loyaltyGifts[0])
  }, [status, loyaltyGifts])

  const claimLoyaltyGift = useContractWrite( 
    {
      address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
      abi: loyaltyProgramAbi,
      functionName: "claimLoyaltyGift", 
      args: [
        `${token?.metadata?.name}`, 
        `${token?.metadata?.attributes[1].value} points`,
        qrData?.loyaltyToken,
        qrData?.loyaltyTokenId, 
        qrData?.loyaltyCardId, 
        qrData?.customerAddress,
        token?.metadata?.attributes[1].value, 
        qrData?.signature
      ], 
      onError(error) {
        console.log('claimLoyaltyGift Error', error)
      }, 
      onSuccess(data) {
        setHashTransaction(data.hash)
      },
    } 
  )

  // const { data, isError, isLoading, isSuccess } = useWaitForTransaction(
  //   { 
  //     confirmations: 2,
  //     hash: hashTransaction 
  //   })

  useEffect(() => {
    if (pointsReceived) {
      dispatch(notification({
        id: "claimGift",
        message: `Points received.`, 
        colour: "green",
        isVisible: true
      }))
    }
  },[ pointsReceived ])

  const handleSubmit = () => {
    console.log("simulated entry data into claimLoyaltyGift: ", 
      [
        `${token?.metadata?.name}`, 
        `${token?.metadata?.attributes[1].value} points`,
        qrData?.loyaltyToken,
        BigInt(Number(qrData?.loyaltyTokenId)), 
        BigInt(Number(qrData?.loyaltyCardId)), 
        qrData?.customerAddress,
        BigInt(Number(token?.metadata?.attributes[1].value)), 
        qrData?.signature
      ]
    )
    claimLoyaltyGift.write()
  }

  return (
    <div className="grid grid-cols-1 h-full justify-items-center content-between p-3"> 

      <TitleText title = "Redeem gift" subtitle="Exchange loyalty points for a gift or voucher" size = {2} />

      <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-3">

        <div className="w-full grid-span-2 gap-2" > 
          <button 
            className="text-slate-800 dark:text-slate-200 flex font-bold p-3"
            type="submit"
            onClick={() => {
              setData(undefined) 
              setHashTransaction(undefined)}
            } 
            >
            <ArrowLeftIcon
              className="h-7 w-7"
              aria-hidden="true"
            />
          </button>
        </div>

      { token &&  token?.metadata ? 
        <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center">
          <div className="rounded-lg w-max"> 
          
            <Image
                className="rounded-lg"
                width={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
                height={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
                src={token.metadata.imageUri}
                alt="Loyalty Token icon"
              />
          </div>
          
          <div className="grid grid-cols-1 pt-2 content-between w-full h-full">
            <div> 
              <TitleText title={token.metadata.name} subtitle={token.metadata.description} size={1} />
              <div className="text-center text-md text-gray-900 pb-2"> 
                {`Cost: ${token.metadata.attributes[1].value} loyalty points`}
              </div>
            </div>
            {pointsReceived?  
            <p className="text-center text-xl font-bold p-8">
              {token.metadata?.attributes[3].value}
            </p>
            :
            null
            }
            
            <div className="grid grid-cols-1 pt-4">
              <div className="text-center text-lg"> 
                {`Gift #${qrData?.loyaltyTokenId} @${token.giftAddress.slice(0,6)}...${token.giftAddress.slice(36,42)}`}
              </div>
            </div>
          </div>
        </div>
        : 
        null 
        }

        { hashTransaction && !pointsReceived ? 
        <Button appearance = {"grayEmpty"} onClick={() => {}} disabled={true} >
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
        <div className="flex w-full p-2"> 
          <Button appearance = {"greenEmpty"} onClick={() => handleSubmit()} >
              Redeem gift
          </Button>
        </div> 
        } 
      </div>
      <div className='pb-16'/>
    </div>
  )}

function len(messageHashOne: string) {
  throw new Error("Function not implemented.");
}
