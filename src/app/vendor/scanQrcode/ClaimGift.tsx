"use client"; 

// See for eip-712 example https://medium.com/coinmonks/eip-712-example-d5877a1600bd 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useWaitForTransaction, useAccount, usePublicClient } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseEthAddress, parseNumber } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { QrData } from "@/types";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";

type SendPointsProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}

export default function ClaimGift( {qrData, setData}: SendPointsProps ) {
  const dimensions = useScreenDimensions();
  const { status, loyaltyTokens, fetchTokens } = useLoyaltyTokens()
  const [token, setToken] = useState<LoyaltyToken>()
  const { progAddress } =  useUrlProgramAddress();
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const dispatch = useDispatch() 

  console.log("QRDATA @claim gift: ", qrData)
  console.log("loyaltyTokens @claim gift: ", loyaltyTokens)
  console.log("simulated entry data into claimLoyaltyGift: ", 
    [
      `${token?.metadata?.name}`, 
      `${token?.metadata?.attributes[1].value} points`,
      qrData?.loyaltyToken,
      qrData?.loyaltyTokenId, 
      qrData?.loyaltyCardId, 
      qrData?.customerAddress,
      token?.metadata?.attributes[1].value, 
      qrData?.signature
    ]
  )
  
  useEffect(() => {
    if (!loyaltyTokens && qrData) {
            
          fetchTokens([{
            tokenAddress: parseEthAddress(qrData?.loyaltyToken), 
            tokenId: parseNumber(qrData?.loyaltyTokenId) 
          }])
    }
    if (status == "isSuccess" && loyaltyTokens) setToken(loyaltyTokens[0])
  }, [, qrData])

  useEffect(() => {
    if (status == "isSuccess" && loyaltyTokens) setToken(loyaltyTokens[0])
  }, [status, loyaltyTokens])

  const claimLoyaltyGift = useContractWrite( 
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "claimLoyaltyGift", 
      args: [
        `${token?.metadata?.name}`, 
        `${token?.metadata?.attributes[1].value} points`,
        qrData?.loyaltyToken,
        qrData?.loyaltyTokenId, // showed up as undefined.. 
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

  const { data, isError, isLoading, isSuccess } = useWaitForTransaction(
    { 
      confirmations: 1,
      hash: hashTransaction 
    })

  useEffect(() => {
    if (isSuccess) {
      dispatch(notification({
        id: "claimGift",
        message: `Points received.`, 
        colour: "green",
        isVisible: true
      }))
    }
    if (isError) {
      dispatch(notification({
        id: "claimGift",
        message: `Error: No points received.`, 
        colour: "red",
        isVisible: true
      }))
    }
    
  },[isError, isSuccess])


  return (
    <div className="grid grid-cols-1 h-full justify-items-center content-between p-3"> 

      <TitleText title = "Redeem gift" subtitle="Exchange loyalty points for a gift or voucher" size = {2} />

      <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-3">

        <div className="w-full grid-span-2 gap-2" > 
          <button 
            className="text-black flex font-bold p-3"
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
            {isSuccess?  
            <p className="text-center text-xl font-bold p-8">
              {token.metadata?.attributes[3].value}
            </p>
            :
            null
            }
            
            <div className="grid grid-cols-1 pt-4">
              <div className="text-center text-lg"> 
                {`Gift #${qrData?.loyaltyTokenId} @${token.tokenAddress.slice(0,6)}...${token.tokenAddress.slice(36,42)}`}
              </div>
            </div>
          </div>
        </div>
        : 
        null 
        }

        { isLoading ? 
        <div className="flex w-full p-2"> 
          <Button appearance = {"grayEmpty"} onClick={() => {}} >
              <Image
                className="rounded-lg opacity-25 flex-none mx-3 animate-spin"
                width={30}
                height={30}
                src={"/loading.svg"}
                alt="Loading icon"
              />
              Waiting for confirmation
          </Button>
        </div> 
        :
        <div className="flex w-full p-2"> 
          <Button appearance = {"greenEmpty"} onClick={claimLoyaltyGift.write} >
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
