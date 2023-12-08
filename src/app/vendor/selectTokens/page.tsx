"use client"; 
import { ModalMain } from "@/app/components/ModalMain";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./TokenSmall";
import TokenBig from "./TokenBig";
import { DeployedContractLog, EthAddress, LoyaltyToken } from "@/types";
import { useEffect, useState, useRef } from "react";
import { useContractRead } from "wagmi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { getContractEventsProps } from "@/types"
import { parseContractLogs, parseEthAddress, parseLoyaltyContractLogs } from "@/app/utils/parsers";

type setSelectedTokenProps = {
  token: LoyaltyToken; 
  disabled: boolean; 
}


export default function Page() {

  const [loyaltyTokens, setLoyaltyTokens] = useState<LoyaltyToken[] | undefined>() 
  const activeLoyaltyTokens = useRef<LoyaltyToken[] >([]) 
  const inactiveLoyaltyTokens = useRef<LoyaltyToken[] >([]) 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const { progAddress } = useUrlProgramAddress() 
  const {data, ethAddresses, isLoading, isError} = useLoyaltyTokens() 
  const publicClient = usePublicClient()

  useEffect(() => {

    const getSelectedtokens = async () => {
      activeLoyaltyTokens.current = []
      inactiveLoyaltyTokens.current = []

      const addedTokensData: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(progAddress), 
        eventName: 'AddedLoyaltyTokenContract', 
        fromBlock: 1n,
        toBlock: 16330050n
      }); 

      const removedTokensData: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(progAddress), 
        eventName: 'RemovedLoyaltyTokenClaimable', 
        fromBlock: 1n,
        toBlock: 16330050n
      }); 

      const addedTokensDataEvents: EthAddress[] = parseLoyaltyContractLogs(addedTokensData)
      const removedTokensDataEvents: EthAddress[] = parseLoyaltyContractLogs(removedTokensData)
      console.log(
        "addedTokensDataEvents: ", addedTokensDataEvents, 
        "removedTokensDataEvents: ", removedTokensDataEvents
      )

      const countTokensAddedEvents = ethAddresses.map(tokenAddress => 
        addedTokensDataEvents.filter(eventAddress => eventAddress === tokenAddress).length
      )
      console.log("countTokensAddedEvents:" , countTokensAddedEvents)
      const countTokensRemovedEvents = ethAddresses.map(tokenAddress => 
        removedTokensDataEvents.filter(eventAddress => eventAddress === tokenAddress).length
      )
      console.log("countTokensRemovedEvents:" , countTokensRemovedEvents)

      if (loyaltyTokens)
        loyaltyTokens.forEach((token, i) => { 
          
            const check = countTokensAddedEvents[i] - countTokensRemovedEvents[i]
            console.log("check: ", check)
            const selectedLoyaltyToken = loyaltyTokens.find(token => token.tokenAddress === ethAddresses[i])
            // console.log("selectedLoyaltyToken: ", selectedLoyaltyToken)

            if (check > 0 && selectedLoyaltyToken) { 
              activeLoyaltyTokens.current.push(selectedLoyaltyToken)
            } 
            if (check <= 0 && selectedLoyaltyToken) { 
              inactiveLoyaltyTokens.current.push(selectedLoyaltyToken)
            }
          });
    } 

    getSelectedtokens() 

  }, [[ , progAddress, publicClient]])


  console.log(
    "loyaltyTokens: ", loyaltyTokens, 
    "activeLoyaltyTokens: ", activeLoyaltyTokens.current, 
    "inactiveLoyaltyTokens: ", inactiveLoyaltyTokens.current, 
    "dataLoyaltyTokens.isLoading: ", isLoading
    )

  useEffect(() => {

    if (data.length > 0 && !isLoading) {
      setLoyaltyTokens(data)
    }

  }, [ 
    , 
    data, 
    isLoading
  ])

  // console.log("data loyaltyTokens: ", data, " isLoading at LoyaltyToken: ", isLoading )

  return (
     <div className=" w-full grid grid-cols-1 gap-1">

      <div className="h-20 m-3"> 
       <TitleText title = "Select Loyalty Gifts" subtitle="View and select gifts that customers can claim with their loyalty points." size={1} />
      </div> 

      { selectedToken ? 
      <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-3">
        <button 
          className="text-black font-bold p-3"
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
      
      <>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          <div className="col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "Selected Gifts" size={0} />
          </div>

          { activeLoyaltyTokens.current ?
          
          activeLoyaltyTokens.current.map((token: LoyaltyToken) => 
              <div key = {token.tokenAddress} >
                <TokenSmall token = {token} disabled = {false} onClick={() => setSelectedToken({token: token, disabled: false})}  /> 
              </div>
            
            )
          : 
          <div className="col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
            <NoteText message=" Selected tokens will appear here."/>
          </div>
          }
        </div> 
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          <div className="col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "Available Gift Programs" size={0} />
          </div>
          
          { inactiveLoyaltyTokens.current ? 
            inactiveLoyaltyTokens.current.map((token: LoyaltyToken) => 
              <div key = {token.tokenAddress} >
                <TokenSmall token = {token} disabled = {true}  onClick={() => setSelectedToken({token: token, disabled: true})} /> 
              </div>
            )
            : 
            <div className="col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
              <NoteText message="Other available tokens will appear here."/>
            </div>
          }
        </div>
      </>

    }
    
    </div> 
    
  );
}
