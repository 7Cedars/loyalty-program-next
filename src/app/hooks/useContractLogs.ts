"use client"

import { Log, CreateContractEventFilterParameters } from "viem"
import { useState, useEffect } from "react"
import { usePublicClient } from 'wagmi'
import { getContractEventsProps } from "@/types"

// see https://viem.sh/docs/contract/getContractEvents.html for documentation on params of getContractEvents action. 
export const useContractLogs = (parameters: getContractEventsProps) => { // {address, abi, eventName, args, fromBlock, toBlock}
  const publicClient = usePublicClient()
  const [data, setData] = useState<{data: Log[]; isError: Error | null | unknown; isLoading: boolean}>({
        data: [],
        isError: null,
        isLoading: false,
      })
  const result = { data: <Log[]>[], isError: null, isLoading: false };

  // adapted from: https://hackernoon.com/creating-a-custom-hook-for-fetching-asynchronus-data-useasync-hook-with-cache
  // and see https://stackoverflow.com/questions/57847626/using-async-await-inside-a-react-functional-component
  useEffect(() => {
    const getData = async () => {  
      setData({ ...result, isLoading: true });
      try {
          const res: Log[] = await publicClient.getContractEvents(parameters); 
          result.data = res;
          setData(result);
          return data; 
        } catch (error) {
          const result = { data: <Log[]>[], isError: error, isLoading: false };
          setData(result);
          return data; 
        }
      }

      if (result.data.length == 0) {
        getData()
      } 
    }, []);

  return data 
}