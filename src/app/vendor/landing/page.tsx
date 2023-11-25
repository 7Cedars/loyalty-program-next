"use client"; 
import {loyaltyProgramAbi} from "../../../context/abi" 
import { useAccount, useConnect, useDisconnect, useBalance, usePublicClient, useContractEvent, useContractReads } from 'wagmi'
import { useContractLogs } from '@/app/hooks/useContractLogs';
import { getContractEventsProps } from "@/types"
import { useWeb3ModalState, useWeb3ModalEvents } from "@web3modal/wagmi/react";
import { Log } from "viem";
import ShowQrcode from './ShowQrcode';
import { useEffect, useRef } from 'react';
import { useLoyaltyProgramAddress } from "@/app/hooks/useUrl";

export default function Page()  {
  const { address, isReconnecting } = useAccount()
  let parameters:getContractEventsProps = {abi: loyaltyProgramAbi}; 
  const { progAddress, handleProgAddress } = useLoyaltyProgramAddress()

  const {data, isError, isLoading} = useContractLogs(
    { 
      abi: loyaltyProgramAbi, 
      eventName: 'DeployedLoyaltyProgram', 
      args: {owner: address}, 
      fromBlock: 1n,
      toBlock: 16330050n
    }
  )

  const selectedProgram:number | undefined = data.indexOf(item => item.address === progAddress);

  if (selectedProgram != undefined) {
    return <ShowQrcode componentData = {data} selection = {0} /> // NB! 
  } 


  // check if url address is owned by logged in address. 
  // if so: show QR code side. 
  // if not: automatic redirection to site without address uri. 

  // if no address is present in url: 
  // do as I had: 
  // no address available: onboard. 
  // 1 address: is redirect to that page. 
  // 2 or more addresses: choose. 


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
