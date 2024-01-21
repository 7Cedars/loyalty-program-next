"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useContractEvent, useWaitForTransaction, useAccount, useContractRead, useContractReads, usePublicClient } from "wagmi";
import { ERC6551AccountAbi, loyaltyProgramAbi, loyaltyGiftAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseBigInt, parseEthAddress, parseMetadata, parseUri } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { QrData } from "@/types";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { Hex, encodeFunctionData, encodePacked, keccak256, toBytes, toHex } from "viem";
import { useAppSelector } from "@/redux/hooks";
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
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const dispatch = useDispatch() 

  console.log("QRDATA @claim gift: ", qrData)
  console.log("loyaltyTokens @claim gift: ", loyaltyTokens)
  console.log("selectedLoyaltyCard @redeem token: ", selectedLoyaltyCard) 

  console.log("simulated entry data into claimLoyaltyGift: ", 
    [
      qrData?.loyaltyToken, 
      qrData?.loyaltyTokenId, 
      qrData?.loyaltyCardAddress,
      qrData?.customerAddress,
      qrData?.loyaltyPoints,
      qrData?.signature
    ]
  )

  const {data: nonceData} = useContractRead(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "getNonceLoyaltyCard", 
      args: [qrData?.loyaltyCardAddress],
      onSuccess(data) {
        console.log("DATA getNonceLoyaltyCard: ", data)
      }, 
    }
  )

  useEffect(() => {
    if (qrData && qrData.loyaltyToken && qrData.loyaltyTokenId) {
            
          fetchTokens([{
            tokenAddress: parseEthAddress(qrData?.loyaltyToken), 
            tokenId: qrData?.loyaltyTokenId
          }])
    }
    if (status == "isSuccess" && loyaltyTokens) setToken(loyaltyTokens[0])
  }, [, qrData])

  const verifyQrCode = async () => {
    console.log("verifyQrCode called") 

    if (
      qrData && 
      qrData.loyaltyToken && 
      qrData.loyaltyTokenId && 
      qrData.loyaltyCardAddress && 
      qrData.customerAddress &&
      qrData.loyaltyPoints && 
      qrData.signature
      ) {

      const messageHash = keccak256(encodePacked(
        ['address', 'uint256', 'address', 'address', 'uint256', 'uint256'], 
        [
          qrData.loyaltyToken, 
          BigInt(Number(qrData.loyaltyTokenId)), 
          qrData.loyaltyCardAddress,
          qrData.customerAddress,
          BigInt(Number(qrData.loyaltyPoints)),
          BigInt(Number(parseBigInt(nonceData)))
        ]
      ))

      const valid = await publicClient.verifyMessage({
        address: qrData.customerAddress,
        message: messageHash,
        signature: qrData.signature
      })
      console.log("verifyQrCode is valid?: ", valid )
    }
  }
  
  const claimLoyaltyGift = useContractWrite( 
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "claimLoyaltyGift", 
      args: [
        qrData?.loyaltyToken,
        BigInt(Number(qrData?.loyaltyTokenId)), 
        qrData?.loyaltyCardAddress,
        qrData?.customerAddress,
        BigInt(Number(qrData?.loyaltyPoints)), 
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

  useEffect(() => {
    if (status == "isSuccess" && loyaltyTokens) setToken(loyaltyTokens[0])
  }, [status, loyaltyTokens])
  
  
  return (
    <div className="grid grid-cols-1 h-full justify-items-center content-between p-3"> 

      <TitleText title = "Claim gift" subtitle="....." size = {2} />

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

      { token &&  token?.metadata ? 
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
              <div className="text-center text-md text-gray-900 pb-2"> 
                {`Cost: ${token.metadata.attributes[1].value}`}
              </div>
            </div>
            <div className="grid grid-cols-1 pt-4">
              <div className="text-center text-lg"> 
                {`Gift #${qrData?.loyaltyTokenId} @${token.tokenAddress.slice(0,6)}...${token.tokenAddress.slice(36,42)}`}
              </div>
              <div className="text-center text-lg"> 
                {`Minted gifts: TBI`}
              </div>
              <div className="text-center text-lg"> 
                {`Remaining gifts: TBI`}
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
          <Button appearance = {"greenEmpty"} onClick={claimLoyaltyGift.write} >
              Claim gift
          </Button>
          <Button appearance = {"blueEmpty"} onClick={() => verifyQrCode()} >
              Verify signer
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