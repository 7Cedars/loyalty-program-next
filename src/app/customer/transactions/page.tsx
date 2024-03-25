"use client"; 

import { TitleText } from "@/app/ui/StandardisedFonts";
import { useRef, useState } from "react";
import { Transaction, Status } from "@/types";
import { Log } from "viem";
import { 
  parseEthAddress, 
  parseTransferSingleLogs, 
} from "@/app/utils/parsers";
import { loyaltyProgramAbi, loyaltyGiftAbi } from "@/context/abi";
import {  usePublicClient } from "wagmi";
import { useEffect } from "react";
import { NoteText } from "@/app/ui/StandardisedFonts";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { toShortDateFormat, toFullDateFormat, toEurTimeFormat } from "@/app/utils/timestampToDate";

export default function Page() {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const {selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram)
  const publicClient = usePublicClient(); 
  
  const [transactionsPointsTo, setTransactionsPointsTo] = useState<Transaction[]>([]) 
  const [transactionsPointsFrom, setTransactionsPointsFrom] = useState<Transaction[]>([])  
  const [transactionsTokensTo, setTransactionsTokensTo] = useState<Transaction[]>([]) 
  const [transactionsTokensFrom, setTransactionsTokensFrom] = useState<Transaction[]>([])  
  const [ transactions, setTransactions ] = useState<Transaction[]>([]) 
  
  const statusTransactionsTo = useRef<Status>("isIdle") 
  const statusTransactionsFrom = useRef<Status>("isIdle") 
  const statusTokensTo = useRef<Status>("isIdle") 
  const statusTokensFrom = useRef<Status>("isIdle") 
  const statusBlockData= useRef<Status>("isIdle") 
  const [status, setStatus] = useState<Status>("isIdle") 

  console.log("transactions: ", transactions)
  console.log("status at transactions: ", {
    statusTransactionsTo: statusTransactionsTo, 
    statusTransactionsFrom: statusTransactionsFrom, 
    statusTokensTo: statusTokensTo, 
    statusTokensFrom: statusTokensFrom, 
    statusBlockData: statusBlockData, 
    status: status
  })

  const getTransactionsTo = async () => {
    statusTransactionsTo.current = "isLoading"
    if (publicClient)
    try { 
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'TransferSingle', 
        args: {
          to: selectedLoyaltyCard?.cardAddress
        },
        fromBlock: 25888893n
      });
      const transactions =  parseTransferSingleLogs(transferSingleLogs)
      // console.log("incoming getTransactionsTo transactions: ", transactions)
      setTransactionsPointsTo([...transactions])
      statusTransactionsTo.current = "isSuccess" 
    } catch (error) {
      statusTransactionsTo.current = "isError"
      console.log(error)
    }
  }

  const getTransactionsFrom = async () => {
    statusTransactionsFrom.current = "isLoading"
    if (publicClient)
    try { 
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'TransferSingle', 
        args: {
          from: selectedLoyaltyCard?.cardAddress
        },
        fromBlock: 25888893n
      });
      const transactions =  parseTransferSingleLogs(transferSingleLogs)
      setTransactionsPointsFrom([...transactions])
      statusTransactionsFrom.current = "isSuccess"

    } catch (error) {
      statusTransactionsFrom.current = "isError"
      console.log(error)
    }
  }

  const getTokensTo = async () => {
    statusTokensTo.current = "isLoading"
    if (publicClient)
    try {
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyGiftAbi, 
        eventName: 'TransferSingle', 
        args: {
          to: selectedLoyaltyCard?.cardAddress
        },
        fromBlock: 25888893n
      });
      const transactions =  parseTransferSingleLogs(transferSingleLogs)
      setTransactionsTokensTo([...transactions])
      statusTokensTo.current = "isSuccess"
    } catch (error) {
      statusTokensTo.current = "isError"
      console.log(error)
    }
  }

  const getTokensFrom = async () => {
    statusTokensFrom.current = "isLoading"
    if (publicClient)
    try {
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyGiftAbi, 
        eventName: 'TransferSingle', 
        args: {
          from: selectedLoyaltyCard?.cardAddress
        },
        fromBlock: 25888893n
      });
      const transactions =  parseTransferSingleLogs(transferSingleLogs)
      setTransactionsTokensFrom(transactions)
      statusTokensFrom.current = "isSuccess"
    } catch (error) {
      statusTokensFrom.current = "isError"
      console.log(error)
    }
  }

  const getBlockData = async () => {
    statusBlockData.current = "isLoading"
    console.log("getBlockData Triggered!")

    let transaction: Transaction
    let transactionUpdated: Transaction[] = []

    if (transactions && publicClient) { 
      try {
        for await (transaction of transactions) {
        const data: unknown = await publicClient.getBlock({
          blockNumber: BigInt(Number(transaction.blockNumber)) 
        })
        transactionUpdated.push({...transaction, blockData: data})
      }
      setTransactions(transactionUpdated) 
      statusBlockData.current = "isSuccess" 
      } catch (error) {
        statusBlockData.current = "isError" 
        console.log(error)
      }
    }
  }
  
  useEffect(() => {
    getTransactionsTo()
    getTransactionsFrom()
    getTokensTo()
    getTokensFrom()
  }, [ ])

  useEffect(() => {
    if (
      transactionsPointsTo && 
      transactionsPointsFrom && 
      transactionsTokensTo && 
      transactionsTokensFrom && 
      statusTransactionsTo.current == "isSuccess" && 
      statusTransactionsFrom.current == "isSuccess" &&
      statusTokensTo.current == "isSuccess" && 
      statusTokensFrom.current== "isSuccess"
      ) {
        const allTransactions = [...transactionsPointsTo, ...transactionsPointsFrom, ...transactionsTokensTo, ...transactionsTokensFrom]

        allTransactions.sort((firstTransaction, secondTransaction) => 
          Number(secondTransaction.blockNumber) - Number(firstTransaction.blockNumber)
        );
        setTransactions(allTransactions)
      }
  }, [
    transactionsPointsTo, 
    transactionsPointsFrom, 
    transactionsTokensTo, 
    transactionsTokensFrom
  ])

  useEffect(() => {
    if (
      statusTransactionsTo.current == "isSuccess" && 
      statusTransactionsFrom.current == "isSuccess" &&
      statusTokensTo.current == "isSuccess" && 
      statusTokensFrom.current == "isSuccess" && 
      statusBlockData.current == "isIdle"  && 
      transactions.length > 0 
    ) {
      getBlockData() 
    }
  }, [ 
    transactions
  ])

  // updating status
  useEffect(() => {
    if (
      statusTransactionsTo.current == "isError" || 
      statusTransactionsFrom.current == "isError" ||
      statusTokensTo.current == "isError" || 
      statusTokensFrom.current == "isError" || 
      statusBlockData.current == "isError"
    ) {
      setStatus("isError")
    }
    if (
      statusTransactionsTo.current == "isLoading" || 
      statusTransactionsFrom.current == "isLoading" ||
      statusTokensTo.current == "isLoading" || 
      statusTokensFrom.current == "isLoading" || 
      statusBlockData.current == "isLoading"
    ) {
      setStatus("isLoading")
    }
    if (
      statusTransactionsTo.current == "isSuccess" && 
      statusTransactionsFrom.current == "isSuccess" &&
      statusTokensTo.current == "isSuccess" && 
      statusTokensFrom.current == "isSuccess" && 
      statusBlockData.current == "isSuccess"
    ) {
      setStatus("isSuccess")
    }
  }, [ 
    transactions
  ])

  return (
    <div className="grid grid-cols-1 h-full content-between">
      <div className="grid grid-cols-1 h-full overflow-auto px-2 justify-items-center">
        <TitleText title = "Transaction Overview" subtitle="See transactions, mint loyalty points and cards." size = {2} />
        { 
         status == "isLoading" ? 
         <div className="grow flex flex-col self-center items-center justify-center pt-12 text-slate-800 dark:text-slate-200 z-40">
          <Image
            className="rounded-lg flex-none mx-3 animate-spin self-center"
            width={60}
            height={60}
            src={"/images/loading2.svg"}
            alt="Loading icon"
          />
          <div className="text-center text-slate-500 mt-6"> 
            Retrieving transactions history...    
          </div> 
        </div>
        : 
        transactions && statusBlockData.current == "isSuccess" ? 

            ////////////////////////
            ///  Drawing Table   /// 
            ////////////////////////
            <table className="grow flex flex-col w-full md:w-4/5 border border-slate-300 dark:border-slate-700 mt-8 rounded-lg divide-y">  
              <thead>
                <tr className="grow flex justify-between bg-slate-300 dark:bg-slate-700">
                  <th className="flex grow justify-start text-slate-800 dark:text-slate-200 p-4">
                    Transaction
                    </th>
                  <th className="flex grow justify-start text-slate-800 dark:text-slate-200 p-4">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
              {
              transactions.map((transaction: Transaction, i) => 
                <tr key = {i} className="grow grid grid-cols-2 bg-slate-100 dark:bg-slate-950 odd:bg-opacity-0 even:bg-opacity-100 overflow-auto">
                 { transaction.ids.length === 1 && transaction.ids[0] === 0n && transaction.from === selectedLoyaltyProgram?.programOwner ? 
                    <>
                      <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div className="">
                          Points Received  
                        </div> 
                        <div className="">
                          { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </td>
                      <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div> 
                          {`${transaction.values[0]} points`}
                        </div>
                        <div> 
                          { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </td>
                     </>
                    :
                    transaction.ids.length === 1 && transaction.ids[0] === 0n && transaction.to === selectedLoyaltyProgram?.programOwner ? 
                    <>
                      <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div className="">
                          Gift Claimed  
                        </div> 
                        <div className="">
                          { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </td>
                      <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div> 
                          {`${transaction.values[0]} points`}
                        </div>
                        <div> 
                          { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </td>
                     </>
                    :
                    transaction.ids.length === 1 && transaction.ids[0] !== 0n && transaction.from === selectedLoyaltyProgram?.programAddress ? 
                    <>
                     <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div>
                          Voucher Received 
                        </div>  
                        <div className="">
                          {toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </td>
                      <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div > 
                          Voucher Id: {`${transaction.values[0]}`}
                        </div>
                        <div> 
                          {toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </td>
                     </>
                     :
                     transaction.ids.length === 1 && transaction.ids[0] !== 0n && transaction.to === selectedLoyaltyProgram?.programAddress ? 
                     <>
                     <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div className="">
                          Voucher Redeemed
                        </div> 
                        <div className="">
                          {toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </td>
                      <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div> 
                          Voucher Id: {`${transaction.values[0]}`}
                        </div>
                        <div> 
                          {toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </td>
                     </>
                     :
                     <>
                     <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div className="">
                          Unrecognised
                        </div> 
                        <div className="">
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </td>
                      <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4">
                        <div> 
                          {`to customer address: ${transaction.to}`}
                        </div>
                        <div> 
                        {`Card ID: ${transaction.ids}`}
                        </div> 
                      </td>
                     </>
                 } 
                 </tr>
                )}
              </tbody>
            </table>    
          :
          <div className="m-6"> 
              <NoteText message="Transaction history will appear here."/>
          </div>           
          }
        </div> 
    </div>
  )
}
