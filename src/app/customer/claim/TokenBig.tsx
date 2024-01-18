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
  const address = useAccount() 
  const { signMessage, isSuccess, data: signMessageData, variables } = useSignMessage()
  const [ signature, setSignature ] = useState<any>() 

  
  console.log("token.tokenAddress: ",  token.tokenAddress)
  console.log("selectedLoyaltyCard: ", selectedLoyaltyCard)
  // NB: look into waitForTransactionReceipt from viem (at actions). 



  const nonceLoyaltyCard = useContractRead(
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

    if (address && token && token.tokenId && selectedLoyaltyCard && selectedLoyaltyCard.cardAddress) {

      const messageHash: Hex = keccak256(encodePacked(
          ['address', 'uint256', 'address', 'address', 'uint256', 'uint256', 'uint256'],
          [
            token.tokenAddress, 
            BigInt(Number(token.tokenId)), 
            selectedLoyaltyCard.cardAddress, 
            parseEthAddress(address), 
            BigInt(Number(token.metadata?.attributes[1].value)), 
            1n,
            BigInt(Number(nonceLoyaltyCard))
          ]
        ))
        signMessage({message: messageHash}) 
      }
  } 

  useEffect(() => {
    if (isSuccess) setSignature(signMessageData)
    if (!isSuccess) setSignature(undefined)
  }, [, isSuccess])




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

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center "> 
      { token.metadata ? 
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
              {token.metadata.description}
            </div>
            <div className="text-center text-sm text-gray-500 pb-4"> 
              {token.metadata.attributes[0].value}
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
        null 
        }
      </div>

      {/* { isLoading ? 
          <div className="p-3 flex "> 
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
        token.availableTokens?.length == 0 ? 
          <div className="p-3 flex "> 
            <Button appearance = {"grayEmpty"} isDisabled onClick={() => {}} >
                No Loyalty Gifts available
            </Button>
          </div> 
        :
        token.metadata && loyaltyPoints && Number(token.metadata.attributes[1].value) > loyaltyPoints ? 
          <div className="p-3 flex "> 
            <Button appearance = {"grayEmpty"} isDisabled onClick={() => {}} >
                Not enough points to claim this gift
            </Button>
          </div> 
        : */}
          <div className="p-3 flex "> 
            <Button appearance = {"greenEmpty"} onClick={() => handleSelectGift()} >
              Claim Gift
            </Button>
          </div> 
        {/* }  */}
      </div>      
  );
}


  // NEED TO REQUEST NONCE... 
  // const encodedFunctionCall: Hex = encodeFunctionData({
  //   abi: loyaltyProgramAbi, 
  //   functionName: "getNonceLoyaltyCard"
  // })