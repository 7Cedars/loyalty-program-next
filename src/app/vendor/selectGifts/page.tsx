"use client"; 
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./GiftSmall";
import TokenBig from "./GiftBig";
import { LoyaltyGift, Status } from "@/types";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient } from 'wagmi'
import { parseEthAddress, parseLoyaltyGiftLogs} from "@/app/utils/parsers";
import { WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants";
import { useLoyaltyGifts } from "@/app/hooks/useLoyaltyGifts";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";

type setSelectedTokenProps = {
  token: LoyaltyGift; 
  disabled: boolean; 
}

export default function Page() {
  const { status: statusUseLoyaltyGifts, loyaltyGifts, fetchGifts } = useLoyaltyGifts()
  const [statusTokenSelection, setStatusTokenSelection] = useState<Status>()
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [activeLoyaltyGifts, setActiveLoyaltyGifts]  = useState<LoyaltyGift[] >([]) 
  const [inactiveLoyaltyGifts, setInactiveLoyaltyGifts] = useState<LoyaltyGift[] >([]) 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const publicClient = usePublicClient()

  console.log("loyaltyGifts @selectGifts: ", loyaltyGifts)

  const getTokenSelection = async () => {
    setStatusTokenSelection("isLoading")
    try {
      const addedGifts: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'AddedLoyaltyGift', 
        fromBlock: 25888893n // this should be part of settings - it differs per block. - this is arbitrum Sepolia. -- see constants 
        // toBlock: 16330050n - if this does not create problems: take out. 
      }); 
      const addedGiftsEvents = parseLoyaltyGiftLogs(addedGifts)

      const removedGifts: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'RemovedLoyaltyGiftClaimable', 
        fromBlock: 25888893n,
        toBlock: 16330050n
      }); 
      const removedGiftsEvents = parseLoyaltyGiftLogs(removedGifts)

      if (loyaltyGifts) {
        let activeGifts: LoyaltyGift[] = [] 
        let inactiveGifts: LoyaltyGift[] = [] 

        loyaltyGifts.forEach((loyaltyToken, i) => { 
          
          const addedEventCount = addedGiftsEvents.filter(
            event => event.giftAddress == loyaltyToken.giftAddress &&  event.giftId == loyaltyToken.giftId
            ).length 
          const removedEventCount = removedGiftsEvents.filter(
            event => event.giftAddress == loyaltyToken.giftAddress &&  event.giftId == loyaltyToken.giftId
            ).length

          if (addedEventCount > removedEventCount) { 
            activeGifts.push(loyaltyToken)
          } else {
            inactiveGifts.push(loyaltyToken)
          }
        })
        setActiveLoyaltyGifts(activeGifts)
        setInactiveLoyaltyGifts(inactiveGifts)
        setStatusTokenSelection("isSuccess")
      } 
    } catch (error) { 
      setStatusTokenSelection("isError")
      console.log(error)
    }
  }

  console.log({
    ActiveLoyaltyGifts: activeLoyaltyGifts, 
    InactiveLoyaltyGifts: inactiveLoyaltyGifts
  })

  useEffect(() => {
    if (!loyaltyGifts) fetchGifts()
    if (loyaltyGifts) getTokenSelection() 
  }, [, selectedToken, loyaltyGifts]) 

  return (
     <div className=" w-full h-full grid grid-cols-1 gap-1 overflow-x-auto">
        <div>
        <TitleText title = "Select Loyalty Gifts" subtitle="View and select gifts that customers can claim with their loyalty points." size={2} />
       </div>
      { selectedToken ? 
      <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-3">
        <button 
          className="text-slate-800 dark:text-slate-200 font-bold p-3"
          type="submit"
          onClick={() => setSelectedToken(undefined)} // should be true / false
          >
          <ArrowLeftIcon
            className="h-7 w-7"
            aria-hidden="true"
          />
        </button>

        <TokenBig token={selectedToken.token} disabled = {selectedToken.disabled} /> 
      
      </div>
      :
      // <div className="grow flex flex-col items-center w-full h-full">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          { 
          statusUseLoyaltyGifts == "isLoading" || 
          statusTokenSelection == "isLoading" ? 
            <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4"> 
              <div className="grow flex flex-col self-center items-center justify-center text-slate-800 dark:text-slate-200 z-40">
                <Image
                  className="rounded-lg flex-none mx-3 animate-spin self-center"
                  width={60}
                  height={60}
                  src={"/images/loading2.svg"}
                  alt="Loading icon"
                />
                { statusUseLoyaltyGifts == "isLoading" ? 
                    <div className="text-center text-slate-500 mt-6"> 
                      Retrieving gift contracts deployed on chain...   
                    </div>  
                  : 
                  statusTokenSelection == "isLoading" ? 
                    <div className="text-center text-slate-500 mt-6"> 
                      Retrieving your gift selection...   
                    </div>  
                  :
                  null 
                }
              </div>
            </div>
          : 
          statusUseLoyaltyGifts == "isSuccess" &&  
          statusTokenSelection == "isSuccess" ?
            // <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
            <>
              <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4"> 
                <TitleText title = "Selected Gifts" size={0} />
              </div>
              { activeLoyaltyGifts.length > 0 ?  
                  activeLoyaltyGifts.map((token: LoyaltyGift) => 
                      token.metadata ? 
                      <div key = {`${token.giftAddress}:${token.giftId}`} >
                        <TokenSmall token = {token} disabled = {false} onClick={() => setSelectedToken({token: token, disabled: false})}  /> 
                      </div>
                      : null 
                    )
                  : 
                  <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
                    <NoteText message="Selected gifts will appear here."/>
                  </div>
              }

              <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4  pt-4 "> 
                <TitleText title = "Available Gifts" size={0} />
              </div>
              { inactiveLoyaltyGifts.length > 0 ? 
                  inactiveLoyaltyGifts.map((token: LoyaltyGift) => 
                    token.metadata ? 
                      <div key = {`${token.giftAddress}:${token.giftId}`} >
                        <TokenSmall token = {token} disabled = {true}  onClick={() => setSelectedToken({token: token, disabled: true})} /> 
                      </div>
                      :
                      null 
                    )
                  :
                  <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
                    <NoteText message="Other available gifts will appear here."/>
                  </div>
              }
            </>
          :
          <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
            <NoteText message="Something went wrong. That's all I know."/>
          </div>
        }
        </div> 
      // </div> 
    }
    <div className="h-16" />
    </div> 
  )
}