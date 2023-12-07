"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseEthAddress } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";

type SelectedTokenProps = {
  token: LoyaltyToken
  disabled: boolean
}

export default function TokenBig( {token, disabled}: SelectedTokenProps ) {
  const dimensions = useScreenDimensions();
  const { progAddress } =  useUrlProgramAddress();
  const dispatch = useDispatch() 

  const addLoyaltyToken = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "addLoyaltyTokenContract", 
      args: [token.tokenAddress], 
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
        console.log('addLoyaltyToken Success', data)
      },
    }
  )

  const removeLoyaltyTokenClaimable = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "removeLoyaltyTokenClaimable", 
      args: [token.tokenAddress], 
      onError(error) {
        dispatch(notification({
          id: "removeLoyaltyTokenClaimable",
          message: `Something went wrong. Loyalty gift has not been removed.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('addLoyaltyToken Error', error)
      }, 
      onSuccess(data) {
        console.log('addLoyaltyToken Success', data)
      },
    }
  )

  return (
    <div className="grid grid-cols-1"> 

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center "> 
      
        <div className="rounded-lg w-max"> 
          <Image
              className="rounded-lg"
              width={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
              height={dimensions.width < 896 ? (dimensions.width - 100) / 2  : 400}
              src={token.metadata.imageUri}
              alt="Loyalty Token icon "
            />
        </div>
        
        <div className="grid grid-cols-1 p-2 content-start">
          <div className="text-center text-sm"> 
            {`${token.metadata.attributes[1].value} ${token.metadata.attributes[1].trait_type}`}
          </div> 
          <div className="text-center text-sm text-gray-500"> 
            {token.metadata.description}
          </div>
        
        </div>
      </div>

      { disabled ? 
        <div className="p-3 flex"> 
          <Button appearance = {"greenEmpty"} onClick={addLoyaltyToken.write} >
            Select Loyalty Gift
          </Button>
        </div> 
        : 
        <div className="p-3 flex"> 
          <Button appearance = {"redEmpty"} onClick={removeLoyaltyTokenClaimable.write} >
            Remove Loyalty Gift
          </Button>
        </div>
      } 
    </div>      
  );
}