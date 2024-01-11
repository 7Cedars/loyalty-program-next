// Custom hook loading all available Loyalty token included in a whitelist.. 

import { Transaction } from "@/types";
import { useEffect, useState } from "react";
import { loyaltyProgramAbi  } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient } from 'wagmi'
import { parseTransferSingleLogs } from "@/app/utils/parsers";
import { useAppSelector } from "@/redux/hooks";

export const useLatestCustomerTransaction = () => {
  const publicClient = usePublicClient();
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)
  const [latestTransaction, setLatestTransaction] = useState<Transaction>() 
  const [pointsReceived, setPointsReceived] = useState<Transaction>() 
  const [pointsSent, setPointsSent] = useState<Transaction>() 
  const [tokenReceived, setTokenReceived] = useState<Transaction>() 
  const [tokenSent, setTokenSent] = useState<Transaction>() 
  
  publicClient.watchContractEvent({
    address: selectedLoyaltyProgram?.programAddress,
    abi: loyaltyProgramAbi,
    eventName: 'TransferSingle', 
    args: {to: selectedLoyaltyCard?.cardAddress, from: selectedLoyaltyCard?.cardAddress}, 
    pollingInterval: 5_000, 
    onLogs: (logs: Log[]) => setLatestTransaction(parseTransferSingleLogs(logs)[0]) 
  })

  useEffect(() => {
    if (
      latestTransaction && 
      latestTransaction.to === selectedLoyaltyCard?.cardAddress &&
      latestTransaction.ids[0] === 0n  
      ) setPointsReceived(latestTransaction)
    if (
      latestTransaction && 
      latestTransaction.from === selectedLoyaltyCard?.cardAddress &&
      latestTransaction.ids[0] === 0n  
      ) setPointsSent(latestTransaction)
    if (
      latestTransaction && 
      latestTransaction.to === selectedLoyaltyCard?.cardAddress &&
      latestTransaction.ids[0] != 0n  
      ) setTokenReceived(latestTransaction)
    if (
      latestTransaction && 
      latestTransaction.from === selectedLoyaltyCard?.cardAddress &&
      latestTransaction.ids[0] != 0n  
      ) setTokenSent(latestTransaction)
  }, [latestTransaction])

  return { 
    latestTransaction, 
    pointsReceived, 
    pointsSent, 
    tokenReceived, 
    tokenSent 
  }
}