"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useContractEvent, useWaitForTransaction, Context, useAccount, useSignMessage, useContractRead } from "wagmi";
import { loyaltyProgramAbi, loyaltyGiftAbi, ERC6551AccountAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseBigInt, parseEthAddress } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { foundry } from "viem/chains";
import { useEffect, useState, useRef } from "react";
import { NumLine } from "@/app/ui/NumLine";
import { useAppSelector } from "@/redux/hooks";
import { encodeAbiParameters, encodePacked, Hex, encodeFunctionData, keccak256 } from "viem";
import { selectLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import QRCode from "react-qr-code";
import { TitleText } from "@/app/ui/StandardisedFonts";


type SelectedTokenProps = {
  token: LoyaltyToken
  loyaltyPoints: number | undefined
  disabled: boolean
}

export default function TokenBig( {token, loyaltyPoints, disabled}: SelectedTokenProps ) {
  const dimensions = useScreenDimensions();
  const { progAddress } =  useUrlProgramAddress();
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const [ isDisabled, setIsDisabled ] = useState<boolean>(disabled) 
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [ selectedGift, setSelectedGift ] = useState<LoyaltyToken>() 
  const dispatch = useDispatch() 
  const {address} = useAccount() 
  const { signMessage, isSuccess, data: signMessageData, variables, isError, error } = useSignMessage()
  const [ signature, setSignature ] = useState<any>() 

  
  console.log("token.tokenAddress: ",  token.tokenAddress)
  console.log("selectedLoyaltyCard: ", selectedLoyaltyCard)
  console.log("signature: ", signature)
  // NB: look into waitForTransactionReceipt from viem (at actions). 
  if (isError) console.log("ERROR: ", error )

  const {data: nonceData} = useContractRead(
    {
      address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
      abi: loyaltyProgramAbi,
      functionName: "getNonceLoyaltyCard", 
      args: [selectedLoyaltyCard?.cardAddress],
      onSuccess(data) {
        console.log("DATA getNonceLoyaltyCard: ", data)
      }, 
    }
  )

  const handleSelectGift = () => {
    console.log("handleSelectGift called: ", {
      address: address, 
      token: token, 
      selectedLoyaltyCard: selectedLoyaltyCard
    })

    if (address && token && selectedLoyaltyCard) {
      console.log("handleSelectGift: PASSED DATA CHECK. NONCE: ", nonceData)

      const messageHash: Hex = keccak256(encodePacked(
          ['address', 'uint256', 'address', 'address', 'uint256', 'uint256', 'uint256'],
          [
            token.tokenAddress, 
            BigInt(Number(token.tokenId)), 
            parseEthAddress(selectedLoyaltyCard.cardAddress), 
            parseEthAddress(address), 
            BigInt(Number(token.metadata?.attributes[1].value)), 
            1n,
            BigInt(Number(nonceData))
          ]
        ))
        console.log("messageHash: ", messageHash)
        signMessage({message: messageHash}) 
        console.log("signMessageData: ", signMessageData)
      } else {
      console.log("handleSelectGift: DID NOT PASS DATA CHECK")
  } 
  }

  useEffect(() => {
    if (isSuccess) setSignature(signMessageData)
    if (!isSuccess) setSignature(undefined)
  }, [, isSuccess, signMessageData])


  // const { data, isError, isLoading, isSuccess } = useWaitForTransaction(
  //   { 
  //     confirmations: 1,
  //     hash: hashTransaction 
  //   })

  // useEffect(() => { 
  //   if (isSuccess) {
  //     setIsDisabled(!isDisabled)
  //     console.log("DATA claimLoyaltyToken: ", data)

  //     dispatch(notification({
  //       id: "claimLoyaltyToken",
  //       message: `Claiming token...`, 
  //       colour: "yellow",
  //       isVisible: true
  //     }))
  //   }
  //   if (isError) {
  //     dispatch(notification({
  //       id: "claimLoyaltyToken",
  //       message: `Something went wrong. Token not claimed.`, 
  //       colour: "red",
  //       isVisible: true
  //     }))
  //   }
  // }, [isSuccess, isError])

  return (
    <div className="grid grid-cols-1"> 

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full justify-items-center "> 
      { token.metadata && !signature ? 
        <>
        <div className="rounded-lg w-max"> 
         
          <Image
              className="rounded-lg"
              width={dimensions.width < 896 ?  Math.min(dimensions.height, dimensions.width) * .35  : 400}
              height={dimensions.width < 896 ?  Math.min(dimensions.height, dimensions.width) * .35 : 400}
              src={token.metadata.imageUri}
              alt="Loyalty Token icon "
            />
        </div>
        
        <div className="grid grid-cols-1 pt-2 content-between w-full h-full">
          <div> 
            <div className="text-center text-lg text-gray-900 text-bold px-1"> 
              {token.metadata.name}
            </div>
            <div className="text-center text-sm text-gray-500 pb-4"> 
              {token.metadata.description}
            </div>

            <div className="text-center text-sm"> 
              {`Cost: ${token.metadata.attributes[1].value} ${token.metadata.attributes[1].trait_type}`}
            </div> 
          </div>
          <div className="text-center text-lg"> 
            {/* {`${token.availableTokens?.length} remaining tokens`} */}
          </div>
        </div>
        </>
        : 
        token.metadata && signature ?
          <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "" subtitle = "Let vendor scan this Qrcode to receive your gift" size={1} />
            <div> 
              <QRCode 
                value={`type:claimgift;lp:${selectedLoyaltyProgram?.programAddress};ga:${token.tokenAddress};li:${token.tokenId};lc:${selectedLoyaltyCard?.cardAddress};ca:${address};lp:${token.metadata.attributes[1].value};sg:${signature}`}
                style={{ height: "400px", width: "100%", objectFit: "cover"  }}
                />
            </div>
          </div>
        : 
        null 
        }
      </div>
        <div className="p-3 flex "> 
          <Button appearance = {"greenEmpty"} onClick={() => handleSelectGift()} >
            Claim Gift
          </Button>
        </div> 
      </div>      
  );
}


  // NEED TO REQUEST NONCE... 
  // const encodedFunctionCall: Hex = encodeFunctionData({
  //   abi: loyaltyProgramAbi, 
  //   functionName: "getNonceLoyaltyCard"
  // })