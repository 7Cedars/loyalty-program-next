"use client"

import { Abi, BlockTag, AbiItem, Log } from "viem"
import {loyaltyProgramAbi} from "../../context/abi" 
import { useState, useRef, useCallback } from "react"
import { useAccount, useConnect, useDisconnect, useBalance, usePublicClient, useContractEvent } from 'wagmi'
import { isPromise } from "util/types"


interface useContractEventsProps { 
  abi: Abi | readonly unknown[], 
  eventName: string, 
  fromBlock: bigint | BlockTag | undefined, 
  toBlock: bigint | BlockTag | undefined
}

const emptyLog: Log = {
  address: `0x0000000000000000000000000000000000000000`,
  blockHash: null,
  blockNumber: null,
  data: `0x0`,
  topics: [], 
  logIndex: null,
  transactionHash: null,
  transactionIndex: null,
  removed: false
}

export const useContractLogs = ({abi, eventName, fromBlock, toBlock}: useContractEventsProps) => {
  const publicClient = usePublicClient()
  const [data, setData] = useState<{data: Log[]; error: Error | null | unknown; loading: boolean}>({
        data: [],
        error: null,
        loading: false,
      })

  // adapted from: https://hackernoon.com/creating-a-custom-hook-for-fetching-asynchronus-data-useasync-hook-with-cache
  useCallback(async () => {
    try {
      const result = { data: [emptyLog], error: null, loading: false };
      setData({ ...result, loading: true });
      const res: Log[] = await publicClient.getContractEvents({ // I should really parse this... anyhow. later, todo. 
        abi: abi,
        eventName: eventName,
        fromBlock: fromBlock,
        toBlock: toBlock
      }); 
      result.data = res;
      console.log("res: ", res)
      setData(result);
      return result;
    } catch (error) {
      const result = { data: [emptyLog], error: error, loading: false };
      setData(result);
      return result;
    }
  }, [abi, publicClient]);  
  
  return { // still have to fill out dependencies. 
    data
  };
};

  
//   // I should really parse this... anyhow. later, todo. 
//     abi: abi,
//     eventName: eventName,
//     fromBlock: fromBlock,
//     toBlock: toBlock
//   });
//         //     try {

  
//   const data = await publicClient.getContractEvents({ // I should really parse this... anyhow. later, todo. 
//     abi: abi,
//     eventName: eventName,
//     fromBlock: fromBlock,
//     toBlock: toBlock
//   });
  
//   return data
// }

// from: https://hackernoon.com/creating-a-custom-hook-for-fetching-asynchronus-data-useasync-hook-with-cache

// import { useState, useCallback } from "react";
// const cache = new Map();
// const defaultOptions = {
//   cacheKey: "",
//   refetch: false,
// };

// export const useAsync = (defaultData?: any) => {
//   const [data, setData] = useState({
//     data: defaultData ?? null,
//     error: null,
//     loading: false,
//   });  

// const run = useCallback(async (asyncFn, options = {}) => {
//     try {
//       // Merge the default options with the options passed in
//       const { cacheKey, refetch } = { ...defaultOptions, ...options };     
//        const result = { data: null, error: null, loading: false };      // If we have a cache key and not requesting a new data, then return the cached data
//       if (!refetch && cacheKey && cache.has(cacheKey)) {
//         const res = cache.get(cacheKey);
//         result.data = res;
//       } else {
//         setData({ ...result, loading: true });
//         const res = await asyncFn();
//         result.data = res;
//         cacheKey && cache.set(cacheKey, res);
//       }
//       setData(result);
//       return result;
//     } catch (error) {
//       const result = { data: null, error: error, loading: false };
//       setData(result);
//       return result;
//     }
//   }, []);  return {
//     ...data,
//     run,
//   };
// };