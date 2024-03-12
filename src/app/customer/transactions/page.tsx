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
  const status = useRef<Status>("isIdle") 

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
    try { 
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'TransferSingle', 
        args: {
          to: selectedLoyaltyCard?.cardAddress
        },
        fromBlock: 5200000n
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

    try { 
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'TransferSingle', 
        args: {
          from: selectedLoyaltyCard?.cardAddress
        },
        fromBlock: 5200000n
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
    try {
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyGiftAbi, 
        eventName: 'TransferSingle', 
        args: {
          to: selectedLoyaltyCard?.cardAddress
        },
        fromBlock: 5200000n
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
    try {
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyGiftAbi, 
        eventName: 'TransferSingle', 
        args: {
          from: selectedLoyaltyCard?.cardAddress
        },
        fromBlock: 5200000n
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

    if (transactions) { 
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

  return (
    <div className="grid grid-cols-1 h-full content-between">
      <div className="grid grid-cols-1 h-full overflow-auto px-2 justify-items-center">
        <TitleText title = "Transaction Overview" subtitle="See transactions, mint loyalty points and cards." size = {2} />
        { 
         status.current == "isLoading" ? 
         <div className="grow flex flex-col self-center items-center justify-center text-slate-800 dark:text-slate-200 z-40">
          <Image
            className="rounded-lg flex-none mx-3 animate-spin self-center"
            width={60}
            height={60}
            src={"/images/loading2.svg"}
            alt="Loading icon"
          />
          <div className="text-center text-slate-500 mt-6"> 
            Retrieving transaction history...    
          </div>  
        </div>
        : 
        transactions && statusBlockData.current == "isSuccess" ? 
            <div className="grid grid-cols-1 w-full md:w-4/5 overflow-auto m-4 mx-2 p-8 divide-y">  
              {
              transactions.map((transaction: Transaction, i) => 
                <div key = {i} className="p-2 ">
                  {
                  transaction.ids.length === 1 && transaction.ids[0] === 0n && transaction.from === selectedLoyaltyProgram?.programOwner ? 
                    <div className="grid grid-cols-1">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          Points Received  
                        </div> 
                        <div className="">
                         { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </div>
                      <div className="flex justify-between">
                        <div> 
                          {`${transaction.values[0]} points`}
                        </div>
                        <div> 
                          { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </div> 
                    </div>
                  :
                  transaction.ids.length === 1 && transaction.ids[0] === 0n && transaction.to === selectedLoyaltyProgram?.programOwner ? 
                    <div className="grid grid-cols-1">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          Gift Claimed
                        </div> 
                        <div className="">
                        { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </div>
                      <div className="flex justify-between">
                        <div> 
                          {`${transaction.values[0]} points`}
                        </div>
                        <div> 
                          { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </div>
                    </div>
                  :
                  transaction.ids.length === 1 && transaction.ids[0] !== 0n && transaction.from === selectedLoyaltyProgram?.programAddress ? 
                    <div className="grid grid-cols-1">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          Voucher Received
                        </div> 
                        <div className="">
                        { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </div>
                      <div className="flex justify-between">
                        <div> 
                          {`Voucher Id: ${transaction.values[0]}`}
                        </div>
                        <div> 
                          { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </div>
                    </div>
                  :
                  transaction.ids.length === 1 && transaction.ids[0] !== 0n && transaction.to === selectedLoyaltyProgram?.programAddress ? 
                    <div className="grid grid-cols-1">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          Voucher Redeemed
                        </div> 
                        <div className="">
                          { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </div>
                      <div className="flex justify-between">
                        <div> 
                          {`Voucher Id: ${transaction.values[0]}`}
                        </div>
                        <div> 
                          { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                        </div> 
                      </div> 
                    </div>
                  :
                    <div className="grid grid-cols-1">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          Unrecognised
                        </div> 
                        <div className="">
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </div>
                      <div> 
                        {`to customer address: ${transaction.to}`}
                      </div>
                      <div> 
                        {`Card ID: ${transaction.ids}`}
                      </div>
                    </div>
                  }
                </div>
              )
              }
            </div>    
          :
          <div className="m-6"> 
              <NoteText message="Transaction history will appear here."/>
          </div>           
          }
        </div> 
    </div>
  )
}
