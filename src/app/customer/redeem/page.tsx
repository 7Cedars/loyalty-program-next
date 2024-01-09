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
  parseTransferSingleLogs
} from "@/app/utils/parsers";
import { WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants";
import { Button } from "@/app/ui/Button";
import { selectLoyaltyCard } from "@/redux/reducers/loyaltyCardReducer";
import { useAppSelector } from "@/redux/hooks";

type setSelectedTokenProps = {
  token: LoyaltyToken; 
  disabled: boolean; 
}

export default function Page() {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [ loyaltyTokens, setLoyaltyTokens ] = useState<LoyaltyToken[] | undefined>() 
  const [ claimedTokens, setClaimedTokens ] = useState<LoyaltyToken[] | undefined>() 
  const [activeLoyaltyTokens, setActiveLoyaltyTokens]  = useState<LoyaltyToken[] >([]) 
  const [inactiveLoyaltyTokens, setInactiveLoyaltyTokens] = useState<LoyaltyToken[] >([]) 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const { progAddress } = useUrlProgramAddress() 
  const {address} = useAccount() 
  // const {data, ethAddresses, isLoading, isError} = useLoyaltyTokens() 
  const publicClient = usePublicClient()

  console.log("UPDATE claimedTokens: ", claimedTokens)

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

  const getClaimedLoyaltyTokens = async () => {
    console.log("getClaimedLoyaltyTokens called")

    let loyaltyToken: LoyaltyToken
    let claimedTokensTemp: LoyaltyToken[] = []

    if (loyaltyTokens) { 
      try {
        for await (loyaltyToken of loyaltyTokens) {

            const claimedTokensLogs: Log[] = await publicClient.getContractEvents({
              address: loyaltyToken.tokenAddress, 
              abi: loyaltyTokenAbi,
              eventName: 'TransferSingle', 
              args: {
                from: parseEthAddress(progAddress), 
                to: selectedLoyaltyCard?.cardAddress
              }, 
              fromBlock: 1n,
              toBlock: 16330050n
            })

            const claimedTokensData = parseTransferSingleLogs(claimedTokensLogs)
            console.log("claimedTokensData: ", claimedTokensData)
            claimedTokensTemp.push(
              ...claimedTokensData.map(
                item => {
                  return ({...loyaltyToken, tokenId: Number(item.ids[0])}) 
                }
              )
            )
          }

          setClaimedTokens(claimedTokensTemp)

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
      getClaimedLoyaltyTokens() 
    
  }, [ , loyaltyTokens])
  
  return (
     <div className=" w-full grid grid-cols-1 gap-1 overflow-auto">

      <div className="h-20 m-3"> 
       <TitleText title = "Select Loyalty Gift to Redeem" subtitle="View and select gifts to redeem at store." size={1} />
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

        <div className="grid grid-cols-2  overflow-auto sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">

          { claimedTokens ?
          
          claimedTokens.map((token: LoyaltyToken) => 
              token.metadata ? 
              <div key = {token.tokenAddress} >
                <TokenSmall token = {token} disabled = {false} onClick={() => setSelectedToken({token: token, disabled: false})}  /> 
              </div>
              : null 
            )
          : 
          <div className="col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
            <NoteText message=" Claimed gifts will appear here."/>
          </div>
          }
        </div> 
      </>
    }
    
    </div> 
    
  );
}
