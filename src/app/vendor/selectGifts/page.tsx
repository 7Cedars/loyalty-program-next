"use client"; 
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./GiftSmall";
import TokenBig from "./GiftBig";
import { LoyaltyToken } from "@/types";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient } from 'wagmi'
import { parseEthAddress, parseLoyaltyGiftLogs} from "@/app/utils/parsers";
import { WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";
import Image from "next/image";

type setSelectedTokenProps = {
  token: LoyaltyToken; 
  disabled: boolean; 
}

export default function Page() {
  const { status, loyaltyTokens, fetchTokens } = useLoyaltyTokens()
  const [activeLoyaltyGifts, setActiveLoyaltyGifts]  = useState<LoyaltyToken[] >([]) 
  const [inactiveLoyaltyGifts, setInactiveLoyaltyGifts] = useState<LoyaltyToken[] >([]) 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const { progAddress } = useUrlProgramAddress() 
  const publicClient = usePublicClient()

  console.log("loyaltyTokens @selectGifts: ", loyaltyTokens)

  const getTokenSelection = async () => {

    const addedGifts: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'AddedLoyaltyGift', 
      fromBlock: 5200000n // this should be part of settings - it differs per block. - this is sepolia. -- see constants 
      // toBlock: 16330050n - if this does not create problems: take out. 
    }); 
    const addedGiftsEvents = parseLoyaltyGiftLogs(addedGifts)

    const removedGifts: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'RemovedLoyaltyGiftClaimable', 
      fromBlock: 5200000n,
      toBlock: 16330050n
    }); 
    const removedGiftsEvents = parseLoyaltyGiftLogs(removedGifts)

    if (loyaltyTokens) {
      let activeGifts: LoyaltyToken[] = [] 
      let inactiveGifts: LoyaltyToken[] = [] 

      loyaltyTokens.forEach((loyaltyToken, i) => { 
        
        const addedEventCount = addedGiftsEvents.filter(
          event => event.giftAddress == loyaltyToken.tokenAddress &&  event.giftId == loyaltyToken.tokenId
          ).length 
        const removedEventCount = removedGiftsEvents.filter(
          event => event.giftAddress == loyaltyToken.tokenAddress &&  event.giftId == loyaltyToken.tokenId
          ).length

        if (addedEventCount > removedEventCount) { 
          activeGifts.push(loyaltyToken)
        } else {
          inactiveGifts.push(loyaltyToken)
        }
      })

      setActiveLoyaltyGifts(activeGifts)
      setInactiveLoyaltyGifts(inactiveGifts)
    }
  }

  console.log({
    ActiveLoyaltyGifts: activeLoyaltyGifts, 
    InactiveLoyaltyGifts: inactiveLoyaltyGifts
  })

  useEffect(() => {
    if (!loyaltyTokens) fetchTokens()
    if (loyaltyTokens) getTokenSelection() 

  }, [selectedToken, loyaltyTokens]) 

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
      <div className="flex flex-col items-center h-full">
        {/* <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start"> */}
          { 
          status == "isLoading" ? 
            <div className="grow text-slate-800 dark:text-slate-200 z-40">
              <Image
                className="rounded-lg flex-none mx-3 animate-spin"
                width={60}
                height={60}
                src={"/loading2.svg"}
                alt="Loading icon"
              />
            </div>
          : 
          status == "isSuccess" ?
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
              <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4"> 
                <TitleText title = "Selected Gifts" size={0} />
              </div>
              { activeLoyaltyGifts.length > 0 ?  
                  activeLoyaltyGifts.map((token: LoyaltyToken) => 
                      token.metadata ? 
                      <div key = {`${token.tokenAddress}:${token.tokenId}`} >
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
                  inactiveLoyaltyGifts.map((token: LoyaltyToken) => 
                    token.metadata ? 
                      <div key = {`${token.tokenAddress}:${token.tokenId}`} >
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
            </div>
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
            

      //       activeLoyaltyGifts && status == "isSuccess" ?
                      
      //       activeLoyaltyGifts.map((token: LoyaltyToken) => 
      //           token.metadata ? 
      //           <div key = {`${token.tokenAddress}:${token.tokenId}`} >
      //             <TokenSmall token = {token} disabled = {false} onClick={() => setSelectedToken({token: token, disabled: false})}  /> 
      //           </div>
      //           : null 
      //         )
      //       : 
      //       <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
      //         <NoteText message="Selected gifts will appear here."/>
      //       </div>
          
        
      //   }

      //     { activeLoyaltyGifts && status == "isSuccess" ?
          
      //     activeLoyaltyGifts.map((token: LoyaltyToken) => 
      //         token.metadata ? 
      //         <div key = {`${token.tokenAddress}:${token.tokenId}`} >
      //           <TokenSmall token = {token} disabled = {false} onClick={() => setSelectedToken({token: token, disabled: false})}  /> 
      //         </div>
      //         : null 
      //       )
      //     : 
      //     <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
      //       <NoteText message="Selected gifts will appear here."/>
      //     </div>
      //     }
      //   </div> 
        
      //   <div className="grid grid-cols-1  xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start overflow-x-scroll">
      //     <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 overflow-x-scroll"> 
      //       <TitleText title = "Available Gifts" size={0} />
      //     </div>
          
      //     { inactiveLoyaltyGifts && status == "isSuccess" ? 
      //       inactiveLoyaltyGifts.map((token: LoyaltyToken) => 
      //         token.metadata ? 
      //         <div key = {`${token.tokenAddress}:${token.tokenId}`} >
      //           <TokenSmall token = {token} disabled = {true}  onClick={() => setSelectedToken({token: token, disabled: true})} /> 
      //         </div>
      //         : null 
      //       )
      //       : 
      //       <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
      //         <NoteText message="Other available gifts will appear here."/>
      //       </div>
      //     }
      //   </div>
      // </div>

    // }
    
    // </div> 
    
  // );
}