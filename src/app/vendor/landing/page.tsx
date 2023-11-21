"use client"; 
import { ModalDialog } from '@/app/ui/ModalDialog';
import {loyaltyProgramAbi} from "../../../context/abi" 
import { useAccount, useConnect, useDisconnect, useBalance, usePublicClient, useContractEvent, useContractReads } from 'wagmi'
import { useContractLogs } from '@/app/hooks/useContractLogs';
import { getContractEventsProps } from "@/types"

import ShowQrcode from './ShowQrcode';


export default function Page()  {
  const { address, isConnecting } = useAccount()
  let parameters: getContractEventsProps = {abi: loyaltyProgramAbi}
  
  address ? parameters = { 
    abi: loyaltyProgramAbi, 
    eventName: 'DeployedLoyaltyProgram', 
    fromBlock: 1n,
    toBlock: 16330050n
  }
  :
  parameters = { 
    abi: loyaltyProgramAbi, 
    eventName: 'DeployedLoyaltyProgram', 
    args: {owner: address}, 
    fromBlock: 1n,
    toBlock: 16330050n
  }

  const {data, isError, isLoading} = useContractLogs(parameters)
  let page: JSX.Element =  <div> ...  </div>; 

  // console.log("data: ", data)
  // console.log("parameters: ", parameters)

  if (data) 
  { 
    if (data.length == 0) {page = (
      <div> Zero deployed contract. Invite to deploy program here </div>
    )}
    if (data.length == 1) {page = (
      <ShowQrcode componentData = {data} selection = {0} /> 
    )}
    if (data.length > 1) {page = (
      <div> Multiple deployed contracts. choose </div>
    )}
  }

  return (
    <div>
    
      {page }
    
    </div>
        
  );
}
