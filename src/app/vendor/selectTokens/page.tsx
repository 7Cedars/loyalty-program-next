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
  parseLoyaltyGiftLogs, 
  parseUri, 
  parseMetadata, 
  parseBigInt
} from "@/app/utils/parsers";
import { WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants";

type setSelectedTokenProps = {
  token: LoyaltyToken; 
  disabled: boolean; 
}

export default function Page() {
  const [loyaltyTokens, setLoyaltyTokens] = useState<LoyaltyToken[] | undefined>() 
  const [activeLoyaltyGifts, setActiveLoyaltyGifts]  = useState<LoyaltyToken[] >([]) 
  const [inactiveLoyaltyGifts, setInactiveLoyaltyGifts] = useState<LoyaltyToken[] >([]) 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const { progAddress } = useUrlProgramAddress() 
  const {address} = useAccount() 
  // const {data, ethAddresses, isLoading, isError} = useLoyaltyTokens() 
  const publicClient = usePublicClient()

  console.log("loyaltyTokens: ", loyaltyTokens)

  const getLoyaltyTokenAddresses = async () => {
    console.log("getLoyaltyTokenAddresses called")

    const loggedAddresses: Log[] = await publicClient.getContractEvents({
      abi: loyaltyGiftAbi, 
      eventName: 'DiscoverableLoyaltyGift', 
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
          const genericUri = parseUri(uri); 
          const specificUri = genericUri.replace("{id}", `000000000000000000000000000000000000000000000000000000000000000${loyaltyToken.tokenId}.json`)

          loyaltyTokensUpdated.push({...loyaltyToken, uri: specificUri})
        
        } catch (error) {
          console.log(error)
          loyaltyTokensUpdated.push({...loyaltyToken, uri: "error"})
        }
      setLoyaltyTokens(loyaltyTokensUpdated.flat())
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
          if (loyaltyToken.uri) {
            const fetchedMetadata: unknown = await(
              await fetch(loyaltyToken.uri)
              ).json()

              console.log("fetchedMetadata @getLoyaltyTokensMetaData", fetchedMetadata) 

            loyaltyTokensUpdated.push({...loyaltyToken, metadata: parseMetadata(fetchedMetadata)})
          }
        } catch (error) {
          console.log(error)
          loyaltyTokensUpdated.push({...loyaltyToken, metadata: "error"})
        }
      }
      setLoyaltyTokens(loyaltyTokensUpdated)
    } 
  }   

  const getAvailableTokens = async () => {

    console.log("getAvailableTokens called")

    let loyaltyToken: LoyaltyToken
    let loyaltyTokensUpdated: LoyaltyToken[] = []

    if (loyaltyTokens) { 
        for await (loyaltyToken of loyaltyTokens) {
          try {

            const availableTokens: unknown = await publicClient.readContract({
              address: loyaltyToken.tokenAddress, 
              abi: loyaltyGiftAbi,
              functionName: 'balanceOf', 
              args: [parseEthAddress(progAddress), loyaltyToken.tokenId]
            })

          loyaltyTokensUpdated.push({...loyaltyToken, availableTokens: Number(parseBigInt(availableTokens))})
        } catch (error) {
          console.log(error)
          loyaltyTokensUpdated.push({...loyaltyToken, availableTokens: "error"})
        }
        setLoyaltyTokens(loyaltyTokensUpdated)
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


  const getTokenSelection = async () => {
    
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

    if (loyaltyTokens) {
      let activeGifts: LoyaltyToken[] = [] 
      let inactiveGifts: LoyaltyToken[] = [] 

      loyaltyTokens.forEach((loyaltyToken, i) => { 
        
        const addedEvenCount = addedGiftsEvents.filter(
          event => event.giftAddress == loyaltyToken.tokenAddress &&  event.giftId == loyaltyToken.tokenId
          ).length 
        const removedEvenCount = removedGiftsEvents.filter(
          event => event.giftAddress == loyaltyToken.tokenAddress &&  event.giftId == loyaltyToken.tokenId
          ).length

        if (addedEvenCount > removedEvenCount) { 
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
    if ( loyaltyTokens  ) { getTokenSelection() }     

  }, [selectedToken, loyaltyTokens]) 

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

          { activeLoyaltyGifts ?
          
          activeLoyaltyGifts.map((token: LoyaltyToken) => 
              token.metadata ? 
              <div key = {`${token.tokenAddress}:${token.tokenId}`} >
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
          
          { inactiveLoyaltyGifts ? 
            inactiveLoyaltyGifts.map((token: LoyaltyToken) => 
              token.metadata ? 
              <div key = {`${token.tokenAddress}:${token.tokenId}`} >
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