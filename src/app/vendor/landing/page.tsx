"use client"; 
import {loyaltyProgramAbi} from "../../../context/abi" 
import { useAccount, useConnect, useDisconnect, useBalance, usePublicClient, useContractEvent, useContractReads } from 'wagmi'
import { useContractLogs } from '@/app/hooks/useContractLogs';
import { getContractEventsProps } from "@/types"
import { useWeb3ModalState, useWeb3ModalEvents } from "@web3modal/wagmi/react";
import { Log } from "viem";
import ShowQrcode from './ShowQrcode';
import { useEffect, useRef } from 'react';

export default function Page()  {
  const publicClient = usePublicClient()
  const { address, isReconnecting } = useAccount()
  let parameters:getContractEventsProps = {abi: loyaltyProgramAbi}; 
  const dataRef = useRef();   

  if (isReconnecting) {
    console.log("RECONNECTING")
  }

  const {data, isError, isLoading} = useContractLogs(
    { 
      abi: loyaltyProgramAbi, 
      eventName: 'DeployedLoyaltyProgram', 
      args: {owner: address}, 
      fromBlock: 1n,
      toBlock: 16330050n
    }
  )
  let page: JSX.Element =  <div> ...  </div>; 

  console.log("logged in address: ", address)
  console.log("data: ", data)
  console.log("parameters: ", parameters)

  if (data) 
  { 
    if (data.length == 0) {page = (
      <div> Zero deployed contracts. Invite to deploy program here </div>
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
