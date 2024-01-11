"use client"; 
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./TokenSmall";
import TokenBig from "./TokenBig";
import { DeployedContractLog, EthAddress, LoyaltyToken } from "@/types";
import { useEffect, useState, useRef } from "react";
import { useContractRead, useContractEvent } from "wagmi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi, loyaltyTokenAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { getContractEventsProps } from "@/types"
import { 
  parseContractLogs, 
  parseEthAddress, 
  parseLoyaltyContractLogs, 
  parseUri, 
  parseMetadata, 
  parseAvailableTokens,
  parseTokenContractLogs,
  parseBigInt
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
  const [activeLoyaltyTokens, setActiveLoyaltyTokens]  = useState<LoyaltyToken[] >([]) 
  const { tokenIsSuccess, loyaltyTokens, fetchTokens } = useLoyaltyTokens()
  const [inactiveLoyaltyTokens, setInactiveLoyaltyTokens] = useState<LoyaltyToken[] >([]) 
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
        args: [ selectedLoyaltyCard?.cardId ]
      });
      
      const loyaltyCardPoints = parseBigInt(loyaltyCardPointsData)
      setLoyaltyPoints(Number(loyaltyCardPoints))
    }
  }
  
  // console.log("loyaltyTokens: ", loyaltyTokens)

  const getTokenSelection = async () => {

    const addedTokens: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'AddedLoyaltyTokenContract', 
      fromBlock: 1n,
      toBlock: 16330050n
    }); 
    const addedTokensEvents: EthAddress[] = parseLoyaltyContractLogs(addedTokens)

    const removedTokens: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'RemovedLoyaltyTokenClaimable', 
      fromBlock: 1n,
      toBlock: 16330050n
    }); 
    const removedTokensEvents: EthAddress[] = parseLoyaltyContractLogs(removedTokens)

    console.log(
      "addedTokensEvents: ", addedTokensEvents, 
      "removedTokensEvents: ", removedTokensEvents
    )

    if (loyaltyTokens) {

      const countTokensAddedEvents = loyaltyTokens.map(loyaltyToken => 
        addedTokensEvents.filter(eventAddress => eventAddress === loyaltyToken.tokenAddress).length
      )
      console.log("countTokensAddedEvents:" , countTokensAddedEvents)
      const countTokensRemovedEvents = loyaltyTokens.map(loyaltyToken => 
        removedTokensEvents.filter(eventAddress => eventAddress === loyaltyToken.tokenAddress).length
      )
      console.log("countTokensRemovedEvents:" , countTokensRemovedEvents)

      let activeTokens: LoyaltyToken[] = [] 
      let inactiveTokens: LoyaltyToken[] = [] 

      loyaltyTokens.forEach((token, i) => { 
        
          const check = countTokensAddedEvents[i] - countTokensRemovedEvents[i]
          const selectedLoyaltyToken = loyaltyTokens.find(token => token.tokenAddress === loyaltyTokens[i].tokenAddress )

          if (check > 0 && selectedLoyaltyToken) { 
            activeTokens.push(selectedLoyaltyToken)
          } 
          if (check <= 0 && selectedLoyaltyToken) { 
            inactiveTokens.push(selectedLoyaltyToken)
          }
        });

        setActiveLoyaltyTokens(activeTokens)
        setInactiveLoyaltyTokens(inactiveTokens)

    }
  } 

  useEffect(() => {
    fetchTokens()
    getLoyaltyCardPoints()
  }, [ ] ) 

  useEffect(() => {
    getTokenSelection() 
  }, [ , selectedToken, loyaltyTokens]) 

  // console.log("data loyaltyTokens: ", data, " isLoading at LoyaltyToken: ", isLoading )

  return (
     <div className=" w-full grid grid-cols-1 gap-1">

      <div className="h-20 m-1"> 
       <TitleText title = "Claim Loyalty Gifts" subtitle="View and redeem loyalty points for gifts." size={2} />
      </div>

      <div className="flex justify-center"> 
        <p className="p-2 w-1/2 text-center border-b border-blue-800">
          {`${loyaltyPoints} loyalty points remaining`}
        </p>
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

        <TokenBig token={selectedToken.token} loyaltyPoints = {loyaltyPoints} disabled = {selectedToken.disabled} /> 
      
      </div>
      :
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          <div className="col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "Available Gifts" size={0} />
          </div>

          { activeLoyaltyTokens ?
          
          activeLoyaltyTokens.map((token: LoyaltyToken) => 
              token.metadata ? 
              <div key = {token.tokenAddress} >
                <TokenSmall token = {token} disabled = {false} onClick={() => setSelectedToken({token: token, disabled: false})}  /> 
              </div>
              : null 
            )
          : 
          <div className="col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
            <NoteText message="No gifts available. Ask vendor to enable gifts."/>
          </div>
          }
        </div> 
      </>

    }
    
    </div> 
    
  );
}
