"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useContractEvent, useWaitForTransaction } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseEthAddress } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { foundry } from "viem/chains";
import { useEffect, useState, useRef } from "react";
import { NumLine } from "@/app/ui/NumLine";

type SelectedTokenProps = {
  token: LoyaltyToken
  disabled: boolean
}

export default function TokenBig( {token, disabled}: SelectedTokenProps ) {
  const dimensions = useScreenDimensions();
  const { progAddress } =  useUrlProgramAddress();
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const [ hashMintTransaction, setHashMintTransaction] = useState<any>()
  const [ isDisabled, setIsDisabled ] = useState<boolean>(disabled) 
  const dispatch = useDispatch() 

  const addLoyaltyGift = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "addLoyaltyGift", 
      args: [token.tokenAddress, token.tokenId], 
      onError(error) {
        dispatch(notification({
          id: "addLoyaltyGift",
          message: `Something went wrong. Loyalty gift has not been added.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('addLoyaltyGift Error', error)
      }, 
      onSuccess(data) {
        setHashTransaction(data.hash)
      },
    }
  )

  const removeLoyaltyGiftClaimable = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "removeLoyaltyGiftClaimable", 
      args: [token.tokenAddress, token.tokenId], 
      onError(error) {
        dispatch(notification({
          id: "removeLoyaltyGiftClaimable",
          message: `Something went wrong. Loyalty gift has not been removed.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('removeLoyaltyGiftClaimable Error', error)
      }, 
      onSuccess(data) {
        setHashTransaction(data.hash)
      }
    }
  )

  const { data, isError, isLoading, isSuccess } = useWaitForTransaction(
    { 
      confirmations: 1,
      hash: hashTransaction 
    })
  

  const mintLoyaltyTokens = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "mintLoyaltyTokens",
      onError(error) {
        dispatch(notification({
          id: "mintLoyaltyTokens",
          message: `Something went wrong. Loyalty tokens not minted.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('mintLoyaltyTokens Error', error)
      }, 
      onSuccess(data) {
        setHashMintTransaction(data.hash)
      }
    }
  )

  const mintTransaction = useWaitForTransaction(
    { 
      confirmations: 1,
      hash: hashMintTransaction 
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
        
        <div className="grid grid-cols-1 pt-2 content-between w-4/5 h-full">
          <div> 
            <div className="text-center text-lg text-gray-900 text-bold px-1"> 
              {token.metadata.name}
            </div>
            <div className="text-center text-md text-gray-500 pb-4"> 
              {token.metadata.description}
            </div>
            <div className="text-center text-md"> 
              {`Cost: ${token.metadata.attributes[1].value} ${token.metadata.attributes[1].trait_type}`}
            </div> 
            <div className="text-center text-md pb-4"> 
              {`Additional requirements: ${token.metadata.attributes[2].value}`}
            </div> 
          </div>
          {token.tokenised ? 
            <div className="text-center text-lg"> 
              {`${token.availableTokens} remaining vouchers.`}
            </div>
            :
            <div className="text-center text-lg"> 
              {`Unlimited supply, gift is redeemed immediately at the till.`}
            </div>
          }

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
        isDisabled ? 
          <div className="p-3 flex "> 
            <Button appearance = {"greenEmpty"} onClick={addLoyaltyGift.write} >
                Select Loyalty Gift
            </Button>
          </div> 
          : 
          <div className="grid grid-col-1 gap-0 w-full">
            { token.tokenised ? 
              <div className="p-3 flex w-full"> 
                <NumLine onClick = {(arg0) => mintLoyaltyTokens.write({
                  args: [token.tokenAddress, [token.tokenId], [arg0]]}
                  )} 
                  isLoading = {mintTransaction.isLoading} /> 
              </div>
              : null
            }
            <div className="p-3 flex "> 
              <Button appearance = {"redEmpty"} onClick={removeLoyaltyGiftClaimable.write} >
                Remove Loyalty Gift
              </Button>
            </div>
          </div>
        } 
      </div>      
  );
}