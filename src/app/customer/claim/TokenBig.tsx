"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useContractEvent, useWaitForTransaction } from "wagmi";
import { loyaltyProgramAbi, loyaltyTokenAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseEthAddress } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { foundry } from "viem/chains";
import { useEffect, useState, useRef } from "react";
import { NumLine } from "@/app/ui/NumLine";
import { useAppSelector } from "@/redux/hooks";

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
  const dispatch = useDispatch() 

  const claimLoyaltyToken = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "redeemLoyaltyPoints", 
      args: [
        token.tokenAddress, 
        Number(token.metadata?.attributes[1].value), 
        selectedLoyaltyCard?.cardId
      ],
      onError(error) {
        dispatch(notification({
          id: "addLoyaltyTokenContract",
          message: `Something went wrong. Loyalty gift has not been added.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('addLoyaltyToken Error', error)
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
      setIsDisabled(!isDisabled)
    }
  }, [isSuccess])

  return (
    <div className="grid grid-cols-1"> 

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center "> 
      { token.metadata ? 
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
            {`${token.availableTokens} remaining tokens`}
          </div>
        </div>
        </>
        : 
        null 
        }
      </div>

      { isLoading ? 
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
        token.availableTokens == 0 ? 
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
        :
          <div className="p-3 flex "> 
            <Button appearance = {"greenEmpty"} onClick={claimLoyaltyToken.write} >
              Claim Loyalty Gift
            </Button>
          </div> 
        } 
      </div>      
  );
}