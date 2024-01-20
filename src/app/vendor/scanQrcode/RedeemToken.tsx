"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useContractEvent, useWaitForTransaction, useAccount } from "wagmi";
import { ERC6551AccountAbi, loyaltyProgramAbi, loyaltyGiftAbi } from "@/context/abi";
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
import { Hex, encodeFunctionData, toBytes } from "viem";
import { useAppSelector } from "@/redux/hooks";
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
  const [ callData, setCallData] = useState<Hex>()
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { address } = useAccount()
  // const { tokenIsSuccess, loyaltyTokens, fetchTokens } = useLoyaltyTokens()

  const dispatch = useDispatch() 
  const publicClient = usePublicClient()

  console.log("QRDATA @redeem token: ", qrData)
  console.log("token @redeem token: ", token)
  console.log("callData @redeem token: ", callData)
  console.log("selectedLoyaltyCard @redeem token: ", selectedLoyaltyCard) 

  const getLoyaltyTokenUris = async () => {
    console.log("getLoyaltyProgramsUris called")

    const uri: unknown = await publicClient.readContract({
      address: parseEthAddress(qrData?.loyaltyToken), 
      abi: loyaltyGiftAbi,
      functionName: 'uri',
      args: [0]
    })

    if (qrData?.loyaltyToken && qrData?.loyaltyTokenId) {
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

  const getEncodedFunctionCall = () => {
    console.log("getEncodedFunctionCall called")

    if (qrData) { 
      const encodedFunctionCall: Hex = encodeFunctionData({
        abi: loyaltyProgramAbi, 
        functionName: "redeemLoyaltyToken", 
        args: 
        [
          qrData.loyaltyToken, 
          qrData.loyaltyTokenId, 
          qrData.loyaltyCardAddress
        ],
      })
      setCallData(encodedFunctionCall)
    }
  }   

  useEffect(() => {
    if (!token && qrData) {
      getLoyaltyTokenUris()
    }
    if (token && qrData && !token.metadata) {
      getLoyaltyTokenMetaData()
    }
    if (token && qrData && token.metadata) {
      getEncodedFunctionCall()
    }

  },[qrData, token])

  console.log("simulated entry data into redeemLoyaltyToken: ", 
    [
      qrData?.loyaltyToken, 
      address, 
      qrData?.loyaltyTokenId, 
      qrData?.loyaltyCardAddress, 
      1n, 
      toBytes(qrData?.signature)
    ]
    )

  const redeemLoyaltyToken = useContractWrite( 
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "redeemLoyaltyTokenUsingSignedMessage", 
      args: [
        qrData?.loyaltyToken, 
        address,
        qrData?.loyaltyTokenId, 
        qrData?.loyaltyCardAddress
        // 1n
        // toBytes(qrData?.signature)
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
        message: `Token successfully retreived: exchange for gift.`, 
        colour: "green",
        isVisible: true
      }))
    }
    if (isError) {
      dispatch(notification({
        id: "redeemToken",
        message: `Error: Loyalty gift not redeemed. Do not give gift.`, 
        colour: "red",
        isVisible: true
      }))
    }
    
  },[isError, isSuccess])
  
  
  return (
    <div className="grid grid-cols-1 h-full justify-items-center content-between p-3"> 

      <TitleText title = "Redeem gift" subtitle="On redeem give loyalty gift to customer." size = {2} />

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
              Redeem gift
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