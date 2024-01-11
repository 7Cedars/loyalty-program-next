// Custom hook loading all available Loyalty token included in a whitelist.. 

import { LoyaltyToken } from "@/types";
import { useEffect, useState } from "react";
import { loyaltyTokenAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient } from 'wagmi'
import { 
  parseUri, 
  parseMetadata, 
  parseTokenContractLogs,
  parseEthAddress,
  parseAvailableTokens,
} from "@/app/utils/parsers";
import { WHITELIST_TOKEN_ISSUERS_FOUNDRY } from "@/context/constants"; // this should be possible to set at website.  
import { useAppSelector } from "@/redux/hooks";

export const useLoyaltyTokens = () => {
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [tokenIsLoading, setTokenIsLoading] = useState<boolean>(true)
  const [tokenIsError, setTokenIsError] = useState<boolean>(false)
  const [tokenIsSuccess, setTokenIsSuccess] = useState<boolean>(false)
  const [loyaltyTokens, setLoyaltyTokens] = useState<LoyaltyToken[] | undefined>() 
  const publicClient = usePublicClient()

  const fetchTokens = () => {
    setTokenIsLoading(true); 
    setTokenIsError(false)
    setTokenIsSuccess(false)
    setLoyaltyTokens(undefined)
    getLoyaltyTokenAddresses()
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
          setTokenIsSuccess(false)
          setTokenIsError(true)
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
          setTokenIsSuccess(false)
          setTokenIsError(true)
          setTokenIsLoading(false)
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
          console.log("getAvailableTokens called. selectedLoyaltyProgram?.programOwner: ", selectedLoyaltyProgram?.programOwner)

          const availableTokens: unknown = await publicClient.readContract({
            address: loyaltyToken.tokenAddress, 
            abi: loyaltyTokenAbi,
            functionName: 'getAvailableTokens', 
            args: [parseEthAddress(selectedLoyaltyProgram?.programAddress)] 
          })
          console.log("getAvailableTokens: ", availableTokens )
          loyaltyTokensUpdated.push({...loyaltyToken, availableTokens: Number(parseAvailableTokens(availableTokens))})
        }

        setLoyaltyTokens(loyaltyTokensUpdated)

        } catch (error) {
          console.log(error)
      }
    }
  }

  if (!loyaltyTokens) { getLoyaltyTokenAddresses() }

  useEffect(() => {
    // check when address has no deployed programs what happens..  
    if (
      loyaltyTokens && 
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.uri) === -1 
      ) { getLoyaltyTokensUris() } 
    if (
      loyaltyTokens && 
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.uri) !== -1  &&  
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.metadata) === -1 
      ) { 
        getLoyaltyTokensMetaData() 
      }
    if (
      loyaltyTokens && 
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.availableTokens != undefined) === -1 
      ) { getAvailableTokens() } 
    if (
      loyaltyTokens &&
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.uri) !== -1  && 
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.metadata) !== -1 && 
      loyaltyTokens.findIndex(loyaltyToken => loyaltyToken.availableTokens != undefined) !== -1 
      ) { 
        setTokenIsSuccess(true)
        setTokenIsError(false)
        setTokenIsLoading(false)
      }
  }, [ , loyaltyTokens, tokenIsLoading])

  return {tokenIsLoading, tokenIsError, tokenIsSuccess, loyaltyTokens, fetchTokens}
}