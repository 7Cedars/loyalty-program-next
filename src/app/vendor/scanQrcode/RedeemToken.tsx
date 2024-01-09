"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useContractEvent, useWaitForTransaction } from "wagmi";
import { loyaltyProgramAbi, loyaltyTokenAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseEthAddress, parseMetadata, parseUri } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { foundry } from "viem/chains";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { NumLine } from "@/app/ui/NumLine";
import { QrData } from "@/types";
import { usePublicClient } from "wagmi";
import { TitleText } from "@/app/ui/StandardisedFonts";

type SendPointsProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}

export default function RedeemToken( {qrData, setData}: SendPointsProps ) {
  const dimensions = useScreenDimensions();
  const { progAddress } =  useUrlProgramAddress();
  const [ token, setToken ] = useState<LoyaltyToken>()
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const [ hashMintTransaction, setHashMintTransaction] = useState<any>()
  const dispatch = useDispatch() 
  const publicClient = usePublicClient()

  console.log("QRDATA: ", qrData)
  console.log("token at redeem token: ", token)


  const getLoyaltyTokenUris = async () => {
    console.log("getLoyaltyProgramsUris called")

    const uri: unknown = await publicClient.readContract({
      address: parseEthAddress(qrData?.loyaltyToken), 
      abi: loyaltyTokenAbi,
      functionName: 'uri',
      args: [0]
    })

    if (qrData?.loyaltyToken) {
      setToken({tokenAddress: qrData.loyaltyToken, uri: parseUri(uri), tokenId: qrData.loyaltyTokenId})
    }
  }

  const getLoyaltyTokenMetaData = async () => {
    console.log("getLoyaltyProgramsMetaData called")

    if (token) { 
          const fetchedMetadata: unknown = await(
            await fetch(parseUri(token.uri))
            ).json()

            setToken({...token, metadata: parseMetadata(fetchedMetadata)})
    }
  }   

  useEffect(() => {
    if (!token && qrData) {
      getLoyaltyTokenUris()
    }
    if (token && qrData && !token.metadata) {
      getLoyaltyTokenMetaData()
    }

  },[qrData, token])

  const redeemLoyaltyToken = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "redeemLoyaltyToken", 
      args: [token?.tokenAddress, token?.tokenId, qrData?.loyaltyCardAddress], 
      onError(error) {
        dispatch(notification({
          id: "redeemLoyaltyToken",
          message: `Error: Loyalty gift not redeemed. Do not give gift.`, 
          colour: "red",
          isVisible: true
        }))
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
  
  return (
    <div className="grid grid-cols-1 h-full justify-items-center content-between"> 

      <TitleText title = "Redeem gift" subtitle="On redeem give loyalty gift to customer." size = {2} />

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center"> 
      { token && token.metadata ? 
        <>
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
            <div className="text-center text-lg"> 
              {`Token ID: ${token.tokenId}`}
            </div>
            <div className="text-center text-lg text-gray-900 text-bold px-1"> 
              {token.metadata.description}
            </div>
            <div className="text-center text-sm text-gray-500 pb-4"> 
              {token.metadata.attributes[0].value}
            </div>
          </div>
          <div className="grid grid-cols-1 pt-4">
            <div className="text-center text-lg"> 
              {`Minted gifts: `}
            </div>
            <div className="text-center text-lg"> 
              {`Remaining gifts: `}
            </div>
          </div>
        </div>
        </>
        : 
        null 
        }
      </div>

      { isLoading ? 
        <div className="p-3 flex w-full pb-16"> 
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
        </div> 
        :
        <div className="p-3 flex w-full pb-16"> 
          <Button appearance = {"greenEmpty"} onClick={redeemLoyaltyToken.write} >
            <div className="flex justify-center items-center">
              Redeem gift
            </div>
          </Button>
        </div> 
        } 
    </div>
  )}