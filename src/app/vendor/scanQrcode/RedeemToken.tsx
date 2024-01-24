"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseEthAddress, parseNumber } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { QrData } from "@/types";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";

type SendPointsProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}

export default function RedeemToken( {qrData, setData}: SendPointsProps ) {
  const dimensions = useScreenDimensions();
  const { progAddress } =  useUrlProgramAddress();
  const [ token, setToken ] = useState<LoyaltyToken>()
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const { status, loyaltyTokens, fetchTokens } = useLoyaltyTokens()
  const dispatch = useDispatch() 

  console.log("QRDATA @redeem token: ", qrData)
  console.log("token @redeem token: ", token)

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

  const redeemLoyaltyToken = useContractWrite( 
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "redeemLoyaltyToken", 
      args: [
        `${token?.metadata?.name}`,
        qrData?.loyaltyToken,
        BigInt(Number(qrData?.loyaltyTokenId)), 
        qrData?.loyaltyCardAddress,
        qrData?.customerAddress,
        qrData?.signature
      ], 
      onError(error) {
        console.log('redeemLoyaltyToken Error', error)
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
        id: "redeemToken",
        message: `Voucher successfully retrieved: exchange for gift.`, 
        colour: "green",
        isVisible: true
      }))
    }
    if (isError) {
      dispatch(notification({
        id: "redeemToken",
        message: `Error: Loyalty Voucher not redeemed. Do not give gift.`, 
        colour: "red",
        isVisible: true
      }))
    }
    
  },[isError, isSuccess])
  
  
  return (
    <div className="grid grid-cols-1 h-full justify-items-center content-between p-3"> 

      <TitleText title = "Redeem Voucher" subtitle="Exchange voucher for gift to customer." size = {2} />

      <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-3">

        <div className="w-full grid-span-2 gap-2"> 
          <button 
            className="text-black font-bold p-3"
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

      { token && token.metadata ? 
        <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center">
          <div className="rounded-lg w-max"> 
          
            <Image
                className="rounded-lg"
                width={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
                height={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
                src={token.metadata.imageUri}
                alt="Loyalty Token icon "
              />
          </div>
          
          <div className="grid grid-cols-1 pt-2 content-between w-full h-full">
            <div> 
              <TitleText title={token.metadata.name} subtitle={token.metadata.description} size={1} />
            </div>
            {isSuccess?  
              <p className="text-center text-xlfont-bold p-4">
                {token.metadata?.attributes[5].value}
              </p>
            :
            null
            }
            <div className="grid grid-cols-1 pt-4">
              <div className="text-center text-md"> 
                {`ID: ${token.tokenId} @${token.tokenAddress.slice(0,6)}...${token.tokenAddress.slice(36,42)}`}
              </div>
              <div className="text-center text-md"> 
                {`Remaining vouchers: ${token.availableTokens}`}
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
              Waiting for confirmation (this can take a few minutes...)
          </Button>
        </div> 
        :
        <div className="flex w-full p-2"> 
          <Button appearance = {"greenEmpty"} onClick={redeemLoyaltyToken.write} >
              Redeem voucher
          </Button>
        </div> 
        } 

      </div>
      
      
         {/* <div className="flex w-full md:px-48 px-6">
        <Button onClick={() => {setData(undefined)}}>
            Back to QR reader
        </Button>
      </div> */}
      <div className='pb-16'/>
    </div>
  )}