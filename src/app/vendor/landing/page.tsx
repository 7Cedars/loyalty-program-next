"use client"; 
import { ModalDialog } from '@/app/ui/ModalDialog';
import {loyaltyProgramAbi} from "../../../context/abi" 
import { useAccount, useConnect, useDisconnect, useBalance, usePublicClient, useContractEvent } from 'wagmi'
import { useContractLogs } from '@/app/hooks/useContractLogs';
import { CreateContractEventFilterParameters } from 'viem'; 
import { ReactComponentElement, ReactHTMLElement } from 'react';
import { getContractEventsProps } from "@/types"

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
  let note: JSX.Element =  <div> ...  </div>; 

  console.log("data: ", data)
  console.log("parameters: ", parameters)

  if (data) 
  { 
    if (data.length == 0) {note = (
      <div> Zero deployed contract. Invite to deploy program here </div>
    )}
    if (data.length == 1) {note = (
      <div> One deployed contract. Login </div>
    )}
    if (data.length > 1) {note = (
      <div> Multiple deployed contracts. choose </div>
    )}
  }

  return (
    <ModalDialog>
    <div className="h-screen w-full flex flex-row space-x-0">
      <div className='mt-20 w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
      {note }
        
      </div>
      
      <div className='mt-20 flex-grow space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        Two
      </div> 
    </div> 
    </ModalDialog>
  );
}
