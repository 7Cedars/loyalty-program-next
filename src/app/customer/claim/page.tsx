"use client"; 
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./TokenSmall";
import TokenBig from "./TokenBig";
import { LoyaltyToken } from "@/types";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient } from 'wagmi'
import { 
  parseEthAddress, 
  parseBigInt,
  parseLoyaltyGiftLogs
} from "@/app/utils/parsers";
import { useAppSelector } from "@/redux/hooks";
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

  const [ selectedToken, setSelectedToken ] = useState<setSelectedTokenProps | undefined>() 
  const { progAddress } = useUrlProgramAddress() 
  const { tokenReceived, latestReceived, pointsReceived, pointsSent } = useLatestCustomerTransaction() 
  const publicClient = usePublicClient()
  const dispatch = useDispatch() 

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
    if (status == "isSuccess" || selectedToken == undefined ) getTokenSelection() 
  }, [, status, selectedToken ]) 

  useEffect(() => {
    if (tokenReceived) {
      dispatch(notification({
        id: "claimLoyaltyToken",
        message: `Success! You received a new voucher. You can see it in the Your Card tab.`, 
        colour: "green",
        isVisible: true
      }))
    }
  }, [tokenReceived])

  return (
     <div className="w-full h-full grid grid-cols-1 gap-1 content-start overflow-auto">

      <div className="h-30">
        <div className="m-1 h-20"> 
        <TitleText title = "Claim Gifts" subtitle="Claim gifts and vouchers with your loyalty points." size={2} />
        </div>

        <div className="flex justify-center"> 
          <p className="p-2 w-1/2 text-center border-b border-slate-700">
            {`${loyaltyPoints} loyalty points`}
          </p>
        </div>
      </div>

      { selectedToken ? 
      <div className="grid grid-cols-1 content-start">
        <div className=" border border-gray-300 rounded-lg m-1">
          <button 
            className="text-black font-bold p-2 grid grid-cols-1 content-start"
            type="submit"
            onClick={() => setSelectedToken(undefined)} // should be true / false
            >
            <ArrowLeftIcon
              className="h-7 w-7"
              aria-hidden="true"
            />
          </button>

          <TokenBig token={selectedToken.token} disabled = {selectedToken.disabled} /> 
          
          {/* <div className="h-32" />  */}
          
        </div>
       
      </div>
      :
      <>
      <div className="overflow-x-scroll">
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
        </div> 
      </>

    }

    
    
    </div> 
    
  );
}
