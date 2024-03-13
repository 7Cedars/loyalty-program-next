// Custom hook loading all available Loyalty token included in a whitelist.. 

import { Transaction } from "@/types";
import { useEffect, useState } from "react";
import { loyaltyProgramAbi  } from "@/context/abi";
import { Log } from "viem"
import { useAccount, usePublicClient } from 'wagmi'
import { parseEthAddress, parseTransferSingleLogs } from "@/app/utils/parsers";
import { useAppSelector } from "@/redux/hooks";

export const useLatestCustomerTransaction = (polling: boolean) => {
  const publicClient = usePublicClient();
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)
  const [latestReceived, setLatestReceived] = useState<Transaction[]>() 
  const [latestSent, setLatestSent] = useState<Transaction[]>() 
  const [pointsReceived, setPointsReceived] = useState<Transaction>() 
  const [pointsSent, setPointsSent] = useState<Transaction>() 
  const [tokenReceived, setTokenReceived] = useState<Transaction>() 
  const [tokenSent, setTokenSent] = useState<Transaction>() 

  if (polling) {
    publicClient.watchContractEvent({
      abi: loyaltyProgramAbi,
      eventName: 'TransferSingle', 
      args: {to: selectedLoyaltyCard?.cardAddress}, 
      pollingInterval: 5_000, 
      onLogs: (logs: Log[]) => setLatestReceived(parseTransferSingleLogs(logs)) 
    })
    console.log("latestReceived: ", latestReceived)
    console.log("latestSent: ", latestSent)
    console.log("selectedLoyaltyProgram @latestTransaction: ", selectedLoyaltyProgram)
    console.log("selectedLoyaltyCard @latestTransaction: ", selectedLoyaltyCard)
  
    publicClient.watchContractEvent({
      abi: loyaltyProgramAbi,
      eventName: 'TransferSingle', 
      args: {from: selectedLoyaltyCard?.cardAddress}, 
      pollingInterval: 5_000, 
      onLogs: (logs: Log[]) => setLatestSent(parseTransferSingleLogs(logs)) 
    })
  }

  useEffect(() => {
    if ( latestReceived && selectedLoyaltyCard)
    latestReceived.forEach(transaction => {
        transaction.ids[0] === 0n ? setPointsReceived(transaction)
        :
        setTokenReceived(transaction)
    })
    
  }, [latestReceived])

  useEffect(() => {
    if ( latestSent && selectedLoyaltyCard)
    latestSent.forEach(transaction => {
        transaction.ids[0] === 0n ? setPointsSent(transaction) 
        : 
        setTokenSent(transaction) 
    })
    
  }, [latestSent])

  return { 
    latestReceived,
    latestSent, 
    pointsReceived, 
    pointsSent, 
    tokenReceived, 
    tokenSent 
  }
}

export const useLatestVendorTransaction = (polling: boolean) => {
  const publicClient = usePublicClient();
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)
  const [latestReceived, setLatestReceived] = useState<Transaction[]>() 
  const [latestSent, setLatestSent] = useState<Transaction[]>() 
  const [pointsReceived, setPointsReceived] = useState<Transaction>() 
  const [pointsSent, setPointsSent] = useState<Transaction>() 
  const [tokenReceived, setTokenReceived] = useState<Transaction>() 
  const [tokenSent, setTokenSent] = useState<Transaction>() 
  const {address} = useAccount() 
  
  if (polling) {
    publicClient.watchContractEvent({
      abi: loyaltyProgramAbi,
      eventName: 'TransferSingle', 
      args: {to: parseEthAddress(address)}, 
      pollingInterval: 5_000, 
      onLogs: (logs: Log[]) => setLatestReceived(parseTransferSingleLogs(logs)) 
    })
    console.log("latestReceived: ", latestReceived)
    console.log("latestSent: ", latestSent)
    console.log("selectedLoyaltyProgram @latestTransaction: ", selectedLoyaltyProgram)
    console.log("selectedvendor @latestTransaction: ", address)

    publicClient.watchContractEvent({
      abi: loyaltyProgramAbi,
      eventName: 'TransferSingle', 
      args: {from: parseEthAddress(address)}, 
      pollingInterval: 5_000, 
      onLogs: (logs: Log[]) => setLatestSent(parseTransferSingleLogs(logs)) 
    })
  }

  useEffect(() => {
    if ( latestReceived && address)
    latestReceived.forEach(transaction => {
        transaction.ids[0] === 0n ? setPointsReceived(transaction)
        :
        setTokenReceived(transaction)
    })
    
  }, [latestReceived])

  useEffect(() => {
    if ( latestSent && address)
    latestSent.forEach(transaction => {
        transaction.ids[0] === 0n ? setPointsSent(transaction) 
        : 
        setTokenSent(transaction) 
    })
    
  }, [latestSent])

  return { 
    latestReceived,
    latestSent, 
    pointsReceived, 
    pointsSent, 
    tokenReceived, 
    tokenSent
  }
}
