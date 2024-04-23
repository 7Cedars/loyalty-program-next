"use client"; 
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import { GiftSmall } from "../../components/GiftSmall";
import GiftBig from "./GiftBig";
import { EthAddress, LoyaltyGift, Status } from "@/types";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { useAccount, usePublicClient } from 'wagmi'
import { parseBigInt, parseEthAddress, parseLoyaltyGiftLogs} from "@/app/utils/parsers";
import { SUPPORTED_CHAINS, WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants";
import { useLoyaltyGifts } from "@/app/hooks/useLoyaltyGifts";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { config } from '../../../../config' 

type SelectedGift = {
  address: EthAddress; 
  id: number; 
} 

// Can I do without this> 
type setSelectedGiftProps = {
  selectedGift: SelectedGift;  
  disabled: boolean; 
}

export default function Page() {
  const { status: statusUseLoyaltyGifts, loyaltyGifts, loyaltyGiftContracts, fetchGifts, updateAvailableVouchers } = useLoyaltyGifts()
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [ claimableLoyaltyGifts, setClaimableLoyaltyGifts ]  = useState<BigInt[] >([]) 
  const [selectedGift, setSelectedGift] = useState<setSelectedGiftProps | undefined>() 
  const publicClient = usePublicClient({config})
  const {chain} = useAccount() 
  const statusGiftSelection = useRef<Status>()

  console.log("claimableLoyaltyGifts: ", claimableLoyaltyGifts)

  const getGiftSelection = async () => {
    statusGiftSelection.current = "isLoading"
      
    let item: LoyaltyGift
    let giftIsClaimable: BigInt[] = []
    
    if  (
      loyaltyGifts != undefined && 
      publicClient && 
      chain
    )   
      try {
        for await (item of loyaltyGifts) {
          const isClaimableRaw: unknown = await publicClient.readContract({ 
            address: parseEthAddress(selectedLoyaltyProgram?.programAddress) , 
            abi: loyaltyProgramAbi,
            functionName: 'getLoyaltyGiftIsClaimable',
            args: [item.giftAddress, item.giftId]
          })
          const isClaimable = parseBigInt(isClaimableRaw); 
          giftIsClaimable.push(isClaimable)
        }
        statusGiftSelection.current = "isSuccess"
        setClaimableLoyaltyGifts(giftIsClaimable)
      } catch (error) {
        statusGiftSelection.current  = "isError"
        console.log("getGiftSelection error: ", error)
      }
  }
  
  useEffect(() => {
    if (!loyaltyGifts) fetchGifts()
    if (loyaltyGifts) getGiftSelection() 
  }, [, selectedGift, loyaltyGifts])

  const handleReturnToMainPage = () => {
    updateAvailableVouchers() 
    setSelectedGift(undefined)
  }

  return (
     <div className=" w-full h-full grid grid-cols-1 gap-1 overflow-x-auto">
        <div>
        <TitleText title = "Select Loyalty Gifts" subtitle="View and select gifts that customers can claim with their loyalty points." size={2} />
       </div>
      { selectedGift && loyaltyGifts? 
        <div className="grid grid-cols-1 content-start border border-gray-700 rounded-lg m-3">
          <button 
            className="text-slate-800 dark:text-slate-200 font-bold p-3"
            type="submit"
            onClick={() => handleReturnToMainPage()} // should be true / false
            >
            <ArrowLeftIcon
              className="h-7 w-7"
              aria-hidden="true"
            />
          </button>

          <GiftBig 
            allGifts= {loyaltyGifts} 
            selectedGift={selectedGift.selectedGift} 
            disabled = {selectedGift.disabled} 
            updateGift = {() => updateAvailableVouchers() } 
            /> 
        </div>
      :
      
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          { 
          statusUseLoyaltyGifts == "isLoading" || 
          statusGiftSelection.current == "isLoading" ? 
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
                  statusGiftSelection.current == "isLoading" ? 
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
          statusGiftSelection.current == "isSuccess" && 
          loyaltyGifts && 
          loyaltyGiftContracts
          ?
          <>
            <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 pt-4 pb-6 w-full"> 
              <TitleText title = "Claimable gifts" size={0} />

              {claimableLoyaltyGifts.indexOf(1n) != -1 ? 
                <div className="flex flex-row overflow-x-auto"> 
                  {claimableLoyaltyGifts.map((claimable: BigInt, i: number) => {
                      const gift = loyaltyGifts[i] 
                      console.log("claimable: ", claimable )
                      return (
                          claimable == 1n ? 
                            <div key = {`${gift.giftAddress}:${gift.giftId}`} >
                              <GiftSmall gift = {gift} disabled = {false} onClick={() => setSelectedGift({selectedGift: {
                                  address: gift.giftAddress,
                                  id: gift.giftId
                                }, disabled: false})}  /> 
                            </div>
                            : 
                            null
                      )
                  })}
                </div>
                :
                <div className="text-sm text-center text-gray-500 italic p-2">
                  Gifts that can be claimed by customers will appear here. Select from below. 
                </div>
                }


            </div> 

            <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 pt-4 w-full"> 
              <TitleText title = "Available Gifts" size={0} />
            
              { loyaltyGiftContracts.map((contractAddress: EthAddress, i:number) => 
                <>
                  <div key = {contractAddress} className="w-full text-md text-slate-800 dark:text-slate-200 text-start ps-3 pt-6"> 
                  Gift Contract: {contractAddress.slice(0, 6)}...{contractAddress.slice(36, 42)}
                  </div> 

                  <div className="flex flex-row overflow-x-auto"> 
                  {loyaltyGifts.map((gift: LoyaltyGift, i: number) =>
                    gift.giftAddress == contractAddress ? 
                      <div key = {`${gift.giftAddress}:${gift.giftId}`} > 
                        <GiftSmall gift = {gift} disabled = { claimableLoyaltyGifts[i] == 0n} onClick={() => setSelectedGift({selectedGift: {
                          address: gift.giftAddress,
                          id: gift.giftId
                        }, disabled: claimableLoyaltyGifts[i] == 0n})}  /> 
                      </div> 
                      :
                      null
                  )}
                  </div>
                </>
              )}
            </div>

          </>
          : 
          null
        }
        </div>
        
      }
      <div className="h-16" /> 
    </div>
    
  )
}