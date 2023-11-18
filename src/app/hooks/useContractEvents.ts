"use client"

import { Abi, BlockTag, AbiItem,  } from "viem"
import {loyaltyProgramAbi} from "../../context/abi" 
import { useState, useRef } from "react"
import { useAccount, useConnect, useDisconnect, useBalance, usePublicClient, useContractEvent } from 'wagmi'

interface useContractEventsProps { 
  abi: Abi | readonly unknown[], 
  eventName: string, 
  fromBlock: bigint | BlockTag | undefined, 
  toBlock: bigint | BlockTag | undefined
}

export const useContractEvents = async ({abi, eventName, fromBlock, toBlock}: useContractEventsProps) => {

  const eventLogs = useRef(Array);

  const publicClient = usePublicClient()
  
  const eventLogsData = await publicClient.getContractEvents({ // I should really parse this... anyhow. later, todo. 
          abi: abi,
          eventName: eventName,
          fromBlock: fromBlock,
          toBlock: toBlock
        })
        

  return eventLogsData

}