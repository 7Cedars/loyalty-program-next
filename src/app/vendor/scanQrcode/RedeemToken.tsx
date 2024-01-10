"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useContractEvent, useWaitForTransaction } from "wagmi";
import { ERC6551AccountAbi, loyaltyProgramAbi, loyaltyTokenAbi } from "@/context/abi";
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
import { Hex, encodeFunctionData } from "viem";
import { useAppSelector } from "@/redux/hooks";

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

  const getEncodedFunctionCall = () => {
    console.log("getEncodedFunctionCall called")

    if (token) { 
      const encodedFunctionCall: Hex = encodeFunctionData({
        abi: loyaltyProgramAbi, 
        functionName: "redeemLoyaltyToken", 
        args: 
        [
          token?.tokenAddress, 
          token?.tokenId, 
          qrData?.loyaltyCardAddress
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

  const redeemLoyaltyToken = useContractWrite(
    {
      address: parseEthAddress(selectedLoyaltyCard?.cardAddress),
      abi: ERC6551AccountAbi,
      functionName: "executeCall", 
      args: [
        parseEthAddress(progAddress), 
        "0", // = 1 ETH
        callData
      ],
      onError(error, context) {
        dispatch(notification({
          id: "claimLoyaltyToken",
          message: `Something went wrong. Loyalty gift was not claimed.`, 
          colour: "red",
          isVisible: true
        })) 
        console.log('claimLoyaltyToken Error', error, context)
      }, 
      onSuccess(data) {
        console.log("DATA claimLoyaltyToken: ", data)
        setHashTransaction(data.hash)
      }, 
    }
  )


  // const redeemLoyaltyToken = useContractWrite(
  //   {
  //     address: parseEthAddress(progAddress),
  //     abi: loyaltyProgramAbi,
  //     functionName: "redeemLoyaltyToken", 
  //     args: [token?.tokenAddress, token?.tokenId, qrData?.loyaltyCardAddress], 
  //     onError(error) {
  //       dispatch(notification({
  //         id: "redeemLoyaltyToken",
  //         message: `Error: Loyalty gift not redeemed. Do not give gift.`, 
  //         colour: "red",
  //         isVisible: true
  //       }))
  //       console.log('redeemLoyaltyToken Error', error)
  //     }, 
  //     onSuccess(data) {
  //       setHashTransaction(data.hash)
  //     },
  //   }
  // )

  const { data, isError, isLoading, isSuccess } = useWaitForTransaction(
    { 
      confirmations: 1,
      hash: hashTransaction 
    })
  
  return (
    <div className="grid grid-cols-1 h-full justify-items-center content-between p-3"> 

      <TitleText title = "Redeem gift" subtitle="On redeem give loyalty gift to customer." size = {2} />

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center border border-gray-300 rounded-lg"> 
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
        <div className="flex md:px-48 px-6"> 
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
        <div className="flex w-full md:px-48 px-6"> 
          <Button appearance = {"greenEmpty"} onClick={redeemLoyaltyToken.write} >
              Redeem gift
          </Button>
        </div> 
        } 
        {/* </div>  */}
        <div className='pb-16'/>
    </div>
  )}