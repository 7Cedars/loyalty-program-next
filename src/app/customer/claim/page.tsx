"use client"; 
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./TokenSmall";
import TokenBig from "./TokenBig";
import { DeployedContractLog, EthAddress, LoyaltyToken } from "@/types";
import { useEffect, useState, useRef } from "react";
import { useContractRead, useContractEvent } from "wagmi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi, loyaltyGiftAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { getContractEventsProps } from "@/types"
import { 
  parseEthAddress, 
  parseBigInt,
  parseLoyaltyGiftLogs
} from "@/app/utils/parsers";
import { WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants";
import { Button } from "@/app/ui/Button";
import { useAppSelector } from "@/redux/hooks";
import { selectLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";
import { useLatestCustomerTransaction } from "@/app/hooks/useLatestTransaction";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";

type setSelectedTokenProps = {
  token: LoyaltyToken; 
  disabled: boolean; 
}

export default function Page() {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>() 
  
  const { status, loyaltyTokens, fetchTokens } = useLoyaltyTokens()
  const [ activeLoyaltyGifts, setActiveLoyaltyGifts]  = useState<LoyaltyToken[] >([]) 

  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const { progAddress } = useUrlProgramAddress() 
  const { tokenReceived, latestReceived, pointsReceived } = useLatestCustomerTransaction() 
  const publicClient = usePublicClient()
  const dispatch = useDispatch() 

  useEffect(() => {
    if (tokenReceived) {
      dispatch(notification({
        id: "claimLoyaltyToken",
        message: `Success! Token Id ${tokenReceived.ids[0]} received.`, 
        colour: "green",
        isVisible: true
      }))
    }
   
  }, [tokenReceived])

  const getLoyaltyCardPoints = async () => {
    console.log("getLoyaltyCardPoints called") 
      if (selectedLoyaltyCard) {
      const loyaltyCardPointsData = await publicClient.readContract({
        address: parseEthAddress(progAddress), 
        abi: loyaltyProgramAbi,
        functionName: 'getBalanceLoyaltyCard', 
        args: [ selectedLoyaltyCard?.cardAddress ]
      });

      console.log("loyaltyCardPointsData: ", loyaltyCardPointsData)
      
      const loyaltyCardPoints = parseBigInt(loyaltyCardPointsData)
      setLoyaltyPoints(Number(loyaltyCardPoints))
    }
  }

  const getTokenSelection = async () => {
    let activeGifts: LoyaltyToken[]; 

    const addedGifts: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'AddedLoyaltyGift', 
      fromBlock: 1n,
      toBlock: 16330050n
    }); 
    const addedGiftsEvents = parseLoyaltyGiftLogs(addedGifts)

    const removedGifts: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'RemovedLoyaltyGiftClaimable', 
      fromBlock: 1n,
      toBlock: 16330050n
    }); 
    const removedGiftsEvents = parseLoyaltyGiftLogs(removedGifts)

    if (loyaltyTokens && removedGiftsEvents && addedGiftsEvents) {      
      loyaltyTokens.forEach(loyaltyToken => { 
        
        const addedEvenCount = addedGiftsEvents.filter(
          event => event.giftAddress == loyaltyToken.tokenAddress && event.giftId == loyaltyToken.tokenId
          ).length 
        const removedEvenCount = removedGiftsEvents.filter(
          event => event.giftAddress == loyaltyToken.tokenAddress && event.giftId == loyaltyToken.tokenId
          ).length
          
        if (!activeGifts) activeGifts = []
        if (addedEvenCount > removedEvenCount) activeGifts.push(loyaltyToken) 
        setActiveLoyaltyGifts(activeGifts)
        
      })
    }
  }

  useEffect(() => {
    fetchTokens()
    getLoyaltyCardPoints()
  }, [ ] ) 

  useEffect(() => {
    if (status == "isSuccess") getTokenSelection() 
  }, [ status ]) 

  return (
     <div className=" w-full grid grid-cols-1 gap-1">

      <div className="h-20 m-1"> 
       <TitleText title = "Claim Gifts" subtitle="Claim gifts with your loyalty points." size={2} />
      </div>

      <div className="flex justify-center"> 
        <p className="p-2 w-1/2 text-center border-b border-blue-800">
          {`${loyaltyPoints} loyalty points remaining`}
        </p>
      </div>

      { selectedToken ? 
      <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-1">
        <button 
          className="text-black font-bold p-2"
          type="submit"
          onClick={() => setSelectedToken(undefined)} // should be true / false
          >
          <ArrowLeftIcon
            className="h-7 w-7"
            aria-hidden="true"
          />
        </button>

        <TokenBig token={selectedToken.token} loyaltyPoints = {loyaltyPoints} disabled = {selectedToken.disabled} /> 
      
      </div>
      :
      <>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "Available Gifts" size={0} />
          </div>

          { activeLoyaltyGifts ?
          
          activeLoyaltyGifts.map((gift: LoyaltyToken) => 
              gift.metadata ? 
              <div key = {`${gift.tokenAddress}:${gift.tokenId}`} >
                <TokenSmall token = {gift} disabled = {false} onClick={() => setSelectedToken({token: gift, disabled: false})}  /> 
              </div>
              : null 
            )
          : 
          <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
            <NoteText message="No gifts available. Ask vendor to enable gifts."/>
          </div>
          }
        </div> 
      </>

    }
    
    </div> 
    
  );
}
