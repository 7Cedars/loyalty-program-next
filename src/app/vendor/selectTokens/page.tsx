"use client"; 
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./TokenSmall";
import TokenBig from "./TokenBig";
import {  EthAddress, LoyaltyToken } from "@/types";
import { useEffect, useState, useRef } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi, loyaltyGiftAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { 
  parseTokenContractLogs, 
  parseEthAddress, 
  parseLoyaltyContractLogs, 
  parseUri, 
  parseMetadata, 
  parseAvailableTokens 
} from "@/app/utils/parsers";
import { WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants";

type setSelectedTokenProps = {
  token: LoyaltyToken; 
  disabled: boolean; 
}

export default function Page() {
  const [loyaltyTokens, setLoyaltyTokens] = useState<LoyaltyToken[] | undefined>() 
  const [activeLoyaltyTokens, setActiveLoyaltyTokens]  = useState<LoyaltyToken[] >([]) 
  const [inactiveLoyaltyTokens, setInactiveLoyaltyTokens] = useState<LoyaltyToken[] >([]) 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const { progAddress } = useUrlProgramAddress() 
  const {address} = useAccount() 
  // const {data, ethAddresses, isLoading, isError} = useLoyaltyTokens() 
  const publicClient = usePublicClient()

  const getLoyaltyTokenAddresses = async () => {
    console.log("getLoyaltyTokenAddresses called")

    const loggedAddresses: Log[] = await publicClient.getContractEvents({
      abi: loyaltyGiftAbi, 
      eventName: 'DiscoverableLoyaltyToken', 
      // args: {issuer: WHITELIST_TOKEN_ISSUERS_FOUNDRY}, 
      fromBlock: 1n,
      toBlock: 16330050n
    });
    console.log("loggedAddresses logs @getLoyaltyTokenAddresses: ", loggedAddresses)

    const loyaltyTokenAddresses = parseTokenContractLogs(loggedAddresses)
    setLoyaltyTokens(loyaltyTokenAddresses)

    console.log("loyaltyTokenAddresses @getLoyaltyTokenAddresses: ", loyaltyTokenAddresses)
  }

  const getLoyaltyTokensUris = async () => {
    console.log("getLoyaltyProgramsUris called")

    let loyaltyToken: LoyaltyToken
    let loyaltyTokensUpdated: LoyaltyToken[] = []

    if (loyaltyTokens) { 

      for await (loyaltyToken of loyaltyTokens) {
        try {
          const uri: unknown = await publicClient.readContract({ 
            address: loyaltyToken.tokenAddress, 
            abi: loyaltyGiftAbi,
            functionName: 'uri',
            args: [loyaltyToken.tokenId]
          })
          console.log("URI @getLoyaltyProgramsUris: ", uri)

          loyaltyTokensUpdated.push({...loyaltyToken, uri: parseUri(uri)})
        
        } catch (error) {
          console.log(error)
          loyaltyTokensUpdated.push({...loyaltyToken, uri: "error"})
        }
      setLoyaltyTokens(loyaltyTokensUpdated)
      }
    }
  }

  const getLoyaltyTokensMetaData = async () => {
    console.log("getLoyaltyProgramsMetaData called")

    let loyaltyToken: LoyaltyToken
    let loyaltyTokensUpdated: LoyaltyToken[] = []

    if (loyaltyTokens) { 
      for await (loyaltyToken of loyaltyTokens) {
        try {

          const fetchedMetadata: unknown = await(
            await fetch(parseUri(loyaltyToken.uri))
            ).json()

            loyaltyTokensUpdated.push({...loyaltyToken, metadata: parseMetadata(fetchedMetadata)})
        } catch (error) {
          console.log(error)
          loyaltyTokensUpdated.push({...loyaltyToken, metadata: "error"})
        }
      }
      setLoyaltyTokens(loyaltyTokensUpdated)
    } 
  }   

  // const getAvailableTokens = async () => {

  //   console.log("getAvailableTokens called")

  //   let loyaltyToken: LoyaltyToken
  //   let loyaltyTokensUpdated: LoyaltyToken[] = []

  //   if (loyaltyTokens) { 
  //       for await (loyaltyToken of loyaltyTokens) {
  //         try {

  //           const availableTokens: unknown = await publicClient.readContract({
  //             address: loyaltyToken.tokenAddress, 
  //             abi: loyaltyGiftAbi,
  //             functionName: 'getAvailableTokens', 
  //             args: [parseEthAddress(progAddress)]
  //           })

  //         loyaltyTokensUpdated.push({...loyaltyToken, availableTokens: Number(parseAvailableTokens(availableTokens))})
  //       } catch (error) {
  //         console.log(error)
  //         loyaltyTokensUpdated.push({...loyaltyToken, availableTokens: "error"})
  //       }
  //       setLoyaltyTokens(loyaltyTokensUpdated)
  //     } 
  //   }
  // }

  useEffect(() => {

    if (!loyaltyTokens) { getLoyaltyTokenAddresses() } // check when address has no deployed programs what happens..  
    if (
      loyaltyTokens && 
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.uri) === -1 
      ) { getLoyaltyTokensUris() } 
    // if (
    //   loyaltyTokens && 
    //   loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.metadata) === -1 
    //   ) { 
    //     getLoyaltyTokensMetaData() 
    //   } 
    // if (
    //   loyaltyTokens && 
    //   loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.availableTokens != undefined) === -1 
    //   ) { getAvailableTokens() } 
  }, [ , loyaltyTokens])

  // useEffect(() => {
  //   getAvailableTokens()
  // }, [ ] ) 
  
  console.log("loyaltyTokens: ", loyaltyTokens)

  // const getTokenSelection = async () => {

  //   const addedTokens: Log[] = await publicClient.getContractEvents( { 
  //     abi: loyaltyProgramAbi, 
  //     address: parseEthAddress(progAddress), 
  //     eventName: 'AddedLoyaltyTokenContract', 
  //     fromBlock: 1n,
  //     toBlock: 16330050n
  //   }); 
  //   const addedTokensEvents: EthAddress[] = parseLoyaltyContractLogs(addedTokens)

  //   const removedTokens: Log[] = await publicClient.getContractEvents( { 
  //     abi: loyaltyProgramAbi, 
  //     address: parseEthAddress(progAddress), 
  //     eventName: 'RemovedLoyaltyTokenClaimable', 
  //     fromBlock: 1n,
  //     toBlock: 16330050n
  //   }); 
  //   const removedTokensEvents: EthAddress[] = parseLoyaltyContractLogs(removedTokens)

  //   console.log(
  //     "addedTokensEvents: ", addedTokensEvents, 
  //     "removedTokensEvents: ", removedTokensEvents
  //   )

  //   if (loyaltyTokens) {

  //     const countTokensAddedEvents = loyaltyTokens.map(loyaltyToken => 
  //       addedTokensEvents.filter(eventAddress => eventAddress === loyaltyToken.tokenAddress).length
  //     )
  //     console.log("countTokensAddedEvents:" , countTokensAddedEvents)
  //     const countTokensRemovedEvents = loyaltyTokens.map(loyaltyToken => 
  //       removedTokensEvents.filter(eventAddress => eventAddress === loyaltyToken.tokenAddress).length
  //     )
  //     console.log("countTokensRemovedEvents:" , countTokensRemovedEvents)

  //     let activeTokens: LoyaltyToken[] = [] 
  //     let inactiveTokens: LoyaltyToken[] = [] 

  //     loyaltyTokens.forEach((token, i) => { 
        
  //         const check = countTokensAddedEvents[i] - countTokensRemovedEvents[i]
  //         const selectedLoyaltyToken = loyaltyTokens.find(token => token.tokenAddress === loyaltyTokens[i].tokenAddress )

  //         if (check > 0 && selectedLoyaltyToken) { 
  //           activeTokens.push(selectedLoyaltyToken)
  //         } 
  //         if (check <= 0 && selectedLoyaltyToken) { 
  //           inactiveTokens.push(selectedLoyaltyToken)
  //         }
  //       });

  //       setActiveLoyaltyTokens(activeTokens)
  //       setInactiveLoyaltyTokens(inactiveTokens)

  //   }
  // } 

  // useEffect(() => {

  //   getTokenSelection() 

  // }, [ , selectedToken, loyaltyTokens]) 



  // console.log("data loyaltyTokens: ", data, " isLoading at LoyaltyToken: ", isLoading )

  return (
     <div className=" w-full grid grid-cols-1 gap-1">

       <TitleText title = "Select Loyalty Gifts" subtitle="View and select gifts that customers can claim with their loyalty points." size={2} />

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
            <NoteText message=" Selected tokens will appear here."/>
          </div>
          }
        </div> 
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          <div className="col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "Available Gift Programs" size={0} />
          </div>
          
          { inactiveLoyaltyTokens ? 
            inactiveLoyaltyTokens.map((token: LoyaltyToken) => 
              token.metadata ? 
              <div key = {token.tokenAddress} >
                <TokenSmall token = {token} disabled = {true}  onClick={() => setSelectedToken({token: token, disabled: true})} /> 
              </div>
              : null 
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
