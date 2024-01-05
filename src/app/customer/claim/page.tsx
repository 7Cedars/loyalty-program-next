"use client"; 
import { ModalMain } from "@/app/vendor/components/ModalMain";
import { useLoyaltyTokens } from "@/depricated/useLoyaltyTokens";
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./TokenSmall";
import TokenBig from "./TokenBig";
import { DeployedContractLog, EthAddress, LoyaltyToken } from "@/types";
import { useEffect, useState, useRef } from "react";
import { useContractRead } from "wagmi";
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

type setSelectedTokenProps = {
  token: LoyaltyToken; 
  disabled: boolean; 
}

export default function Page() {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>() 
  const [loyaltyTokens, setLoyaltyTokens] = useState<LoyaltyToken[] | undefined>() 
  const [activeLoyaltyTokens, setActiveLoyaltyTokens]  = useState<LoyaltyToken[] >([]) 
  const [inactiveLoyaltyTokens, setInactiveLoyaltyTokens] = useState<LoyaltyToken[] >([]) 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const { progAddress } = useUrlProgramAddress() 
  const {address} = useAccount() 

  // const {data, ethAddresses, isLoading, isError} = useLoyaltyTokens() 
  const publicClient = usePublicClient()

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

  const getLoyaltyTokenAddresses = async () => {
    console.log("getLoyaltyTokenAddresses called")

    const loggedAdresses: Log[] = await publicClient.getContractEvents({
      abi: loyaltyTokenAbi,
      eventName: 'DiscoverableLoyaltyToken', 
      args: {issuer: WHITELIST_TOKEN_ISSUERS_FOUNDRY}, 
      fromBlock: 1n,
      toBlock: 16330050n
    });
    const loyaltyTokenAddresses = parseTokenContractLogs(loggedAdresses)
    setLoyaltyTokens(loyaltyTokenAddresses)

    console.log("loyaltyTokenAddresses: ", loyaltyTokenAddresses)
  }

  const getLoyaltyTokensUris = async () => {
    console.log("getLoyaltyProgramsUris called")

    let loyaltyToken: LoyaltyToken
    let loyaltyTokensUpdated: LoyaltyToken[] = []

    if (loyaltyTokens) { 

      try {
        for await (loyaltyToken of loyaltyTokens) {

          const uri: unknown = await publicClient.readContract({
            address: loyaltyToken.tokenAddress, 
            abi: loyaltyTokenAbi,
            functionName: 'uri',
            args: [0]
          })

          loyaltyTokensUpdated.push({...loyaltyToken, uri: parseUri(uri)})
        }

        setLoyaltyTokens(loyaltyTokensUpdated)

        } catch (error) {
          console.log(error)
      }
    }
  }

  const getLoyaltyTokensMetaData = async () => {
    console.log("getLoyaltyProgramsMetaData called")

    let loyaltyToken: LoyaltyToken
    let loyaltyTokensUpdated: LoyaltyToken[] = []

    if (loyaltyTokens) { 
      try {
        for await (loyaltyToken of loyaltyTokens) {

          const fetchedMetadata: unknown = await(
            await fetch(parseUri(loyaltyToken.uri))
            ).json()

            loyaltyTokensUpdated.push({...loyaltyToken, metadata: parseMetadata(fetchedMetadata)})
        }

        setLoyaltyTokens(loyaltyTokensUpdated)

        } catch (error) {
          console.log(error)
      }
    }
  }   

  const getAvailableTokens = async () => {

    console.log("getAvailableTokens called")

    let loyaltyToken: LoyaltyToken
    let loyaltyTokensUpdated: LoyaltyToken[] = []

    if (loyaltyTokens) { 
      try {
        for await (loyaltyToken of loyaltyTokens) {
          console.log("getAvailableTokens CHECK ")

          const availableTokens: unknown = await publicClient.readContract({
            address: loyaltyToken.tokenAddress, 
            abi: loyaltyTokenAbi,
            functionName: 'getAvailableTokens', 
            args: [parseEthAddress(address)]
          })
          console.log("getAvailableTokens: ", availableTokens )
          loyaltyTokensUpdated.push({...loyaltyToken, availableTokens: parseAvailableTokens(availableTokens)})
        }

        setLoyaltyTokens(loyaltyTokensUpdated)

        } catch (error) {
          console.log(error)
      }
    }
  }

  useEffect(() => {

    if (!loyaltyTokens) { getLoyaltyTokenAddresses() } // check when address has no deployed programs what happens..  
    if (
      loyaltyTokens && 
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.uri) === -1 
      ) { getLoyaltyTokensUris() } 
    if (
      loyaltyTokens && 
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.metadata) === -1 
      ) { 
        getLoyaltyTokensMetaData() 
      } 
    if (
      loyaltyTokens && 
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.availableTokens != undefined) === -1 
      ) { getAvailableTokens() } 
  }, [ , loyaltyTokens])

  useEffect(() => {
    getAvailableTokens()
    getLoyaltyCardPoints()
  }, [ ] ) 
  
  console.log("loyaltyTokens: ", loyaltyTokens)

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

    getTokenSelection() 

  }, [ , selectedToken, loyaltyTokens]) 

  // console.log("data loyaltyTokens: ", data, " isLoading at LoyaltyToken: ", isLoading )

  return (
     <div className=" w-full grid grid-cols-1 gap-1">

      <div className="h-20 m-1"> 
       <TitleText title = "Claim Loyalty Gifts" subtitle="View and redeem loyalty points for gifts." size={2} />
      </div>

      <p className="m-3 text-center text-bold text-md"> 
       {`${loyaltyPoints} loyalty points remaining`}
      </p>

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
