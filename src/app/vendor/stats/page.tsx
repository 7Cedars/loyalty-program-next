"use client"; 

import { TitleText } from "@/app/ui/StandardisedFonts";
import { Button } from "@/app/ui/Button";
import { useRef, useState } from "react";
import { Status, Transaction } from "@/types";
import { Log } from "viem";
import { parseEthAddress, parseTransferSingleLogs, parseTransferBatchLogs, parseBigInt } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi";
import { 
  useAccount, 
  usePublicClient, 
  useReadContracts
} from "wagmi";
import { useEffect } from "react";
import { NoteText } from "@/app/ui/StandardisedFonts";
import MintPoints from "../vendorComponents/MintPoints";
import MintCards from "../vendorComponents/MintCards";
import { useAppSelector } from "@/redux/hooks";
import { useVendorAccount } from "@/app/hooks/useVendorAccount";
import Image from "next/image";
import { toEurTimeFormat, toFullDateFormat } from "@/app/utils/timestampToDate";
import { SUPPORTED_CHAINS } from "@/context/constants";
 
export default function Page() {
  const [ modal, setModal] = useState<'points' | 'cards' | undefined>()  
  const { status: statusBalances, balances } = useVendorAccount() // refetchBalances
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const publicClient = usePublicClient(); 
  const { address, chain } = useAccount() 

  const loyaltyProgram = {
    address: selectedLoyaltyProgram?.programAddress,
    abi: loyaltyProgramAbi,
  } as const

  const result = useReadContracts({
    contracts: [
      {
        ...loyaltyProgram,
        functionName: 'transferSingle',
        args: [{from: parseEthAddress(address)}],
      },
      {
        ...loyaltyProgram,
        functionName: 'transferSingle',
        args: [{to: parseEthAddress(address)}],
      },
      {
        ...loyaltyProgram,
        functionName: 'TransferBatch',
        args: [{to: parseEthAddress(address)}],
      }
    ]
  })

  console.log("RESULT STAT DATA FETCH: ", result)
  
  const [ transferSingleTo, setTransferSingleTo ] = useState<Transaction[]>([]) 
  const [ transferSingleFrom, setTransferSingleFrom ] = useState<Transaction[]>([])  
  const [ transferBatchTo, setTransferBatchToTo ] = useState<Transaction[]>([]) 
  const [ transactions, setTransactions ] = useState<Transaction[]>([]) 
  
  const statusTransferSingleTo = useRef<Status>("isIdle") 
  const statusTransferSingleFrom = useRef<Status>("isIdle") 
  const statusTransferBatchTo = useRef<Status>("isIdle") 
  const statusBlockData= useRef<Status>("isIdle") 
  const [status, setStatus] = useState<Status>("isIdle") 

  console.log({
    statusTransferSingleTo: statusTransferSingleTo,
    statusTransferSingleFrom: statusTransferSingleFrom, 
    statusTransferBatchTo: statusTransferBatchTo, 
    statusBlockData: statusBlockData
  })

  console.log("balances: ", balances)

  const getTransferSingleTo = async () => {
    statusTransferSingleTo.current = "isLoading"
    if (publicClient && chain)
    try {
      const selectedChain: any = SUPPORTED_CHAINS.find(block => block.chainId === chain.id)
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'TransferSingle', 
        args: {
          to: parseEthAddress(address)
        },
        fromBlock: selectedChain?.fromBlock
      });
      const transactions =  parseTransferSingleLogs(transferSingleLogs)
      setTransferSingleTo([...transactions])
      statusTransferSingleTo.current = "isSuccess" 
    } catch (error) {
      statusTransferSingleTo.current = "isError"
      console.log(error)
    }
  }

  const getTransferSingleFrom = async () => {
    statusTransferSingleFrom.current = "isLoading"
    if (publicClient && chain)
    try {
      const selectedChain: any = SUPPORTED_CHAINS.find(block => block.chainId === chain.id)
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'TransferSingle', 
        args: {
          from: parseEthAddress(address)
        },
        fromBlock: selectedChain?.fromBlock
      });
      const transactions =  parseTransferSingleLogs(transferSingleLogs)
      setTransferSingleFrom([...transactions])
      statusTransferSingleFrom.current = "isSuccess"
    } catch (error) {
      statusTransferSingleFrom.current = "isError"
      console.log(error)
    }
  }

  const getTransferBatchTo = async () => {
    statusTransferBatchTo.current = "isLoading"
    if (publicClient && chain)
    try {
      const selectedChain: any = SUPPORTED_CHAINS.find(block => block.chainId === chain.id)
      const transferBatchLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
            address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
            eventName: 'TransferBatch', 
            args: {
              to: parseEthAddress(address)
            },
            fromBlock: selectedChain?.fromBlock
          });
      const transactions =  parseTransferBatchLogs(transferBatchLogs)
      setTransferBatchToTo([...transactions])
      statusTransferBatchTo.current = "isSuccess"

    } catch (error) {
      statusTransferBatchTo.current = "isError"
      console.log(error)
    }
  }

  const getBlockData = async () => {
    statusBlockData.current = "isLoading"

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
    getTransferSingleTo()
    getTransferSingleFrom()
    getTransferBatchTo()
    
    // refetchBalances() 
  }, [ ])

  useEffect(() => {
    if (
      transferSingleTo && 
      transferSingleFrom && 
      transferBatchTo && 
      statusTransferSingleTo.current == "isSuccess" && 
      statusTransferSingleFrom.current == "isSuccess" &&
      statusTransferBatchTo.current == "isSuccess"
      ) {
        const allTransactions = [...transferSingleTo, ...transferSingleFrom, ...transferBatchTo]

        allTransactions.sort((firstTransaction, secondTransaction) => 
          Number(secondTransaction.blockNumber) - Number(firstTransaction.blockNumber)
        );
        setTransactions(allTransactions)
      }
  }, [
    transferSingleTo,
    transferSingleFrom,  
    transferBatchTo
  ])

  useEffect(() => {
    if (
      statusTransferSingleTo.current == "isSuccess" && 
      statusTransferSingleFrom.current == "isSuccess" &&
      statusTransferBatchTo.current == "isSuccess" && 
      statusBlockData.current == "isIdle"  && 
      transactions.length > 0 
    ) {
      getBlockData() 
    } 

    if (
      statusTransferSingleTo.current == "isSuccess" && 
      statusTransferSingleFrom.current == "isSuccess" &&
      statusTransferBatchTo.current == "isSuccess" && 
      statusBlockData.current == "isIdle"  && 
      transactions.length == 0 
    ) {
      statusBlockData.current = "isSuccess" 
    } 
  }, [ 
    transactions
  ])

   // updating status
   useEffect(() => {
    if (
      statusTransferSingleTo.current == "isError" || 
      statusTransferSingleFrom.current == "isError" ||
      statusTransferBatchTo.current == "isError" || 
      statusBlockData.current == "isError"
    ) {
      setStatus("isError")
    }
    if (
      statusTransferSingleTo.current == "isLoading" || 
      statusTransferSingleFrom.current == "isLoading" ||
      statusTransferBatchTo.current == "isLoading" || 
      statusBlockData.current == "isLoading"
    ) {
      setStatus("isLoading")
    }
    if (
      statusTransferSingleTo.current == "isSuccess" && 
      statusTransferSingleFrom.current == "isSuccess" &&
      statusTransferBatchTo.current == "isSuccess" && 
      statusBlockData.current == "isSuccess"
    ) {
      setStatus("isSuccess")
    }
  }, [ 
    transactions
  ])

  return (
    <div className="grid grid-cols-1 h-full w-full justify-items-between content-between">
      <div className="grid grid-cols-1 justify-items-center w-full h-full overflow-auto ">
        <TitleText title = "Transaction Overview" subtitle="See transactions, mint loyalty points and cards." size = {2} />
        <div className="grid grid-cols-1 p-2 pt-3 w-5/6 sm:w-2/3 text-center justify-items-center border-b border-slate-700"> 
          <p> {`${balances?.points}`} points | {`${balances?.cards}`} cards </p> 
        </div>

        { 
          modal === 'points' ? 
            <div className="p-3 px-4 grid grid-cols-1 h-full">
              <MintPoints /> 
            </div>
        :
          modal === 'cards' ? 
            <div> 
              <MintCards /> 
            </div>
        : 
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
          <table className="grow flex flex-col w-11/12 border border-slate-300 dark:border-slate-700 mt-8 rounded-lg mx-2">  
            <thead>
              <tr className="grow flex justify-between bg-slate-300 dark:bg-slate-700">
                <th className="flex grow justify-start text-slate-800 dark:text-slate-200 p-2">
                  Transaction
                  </th>
                <th className="flex grow justify-start text-slate-800 dark:text-slate-200 p-2">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody>
            { transactions.map((transaction: Transaction, i) => 
              <tr key = {i} className="grow grid grid-cols-2 bg-slate-100 dark:bg-slate-950 odd:bg-opacity-0 even:bg-opacity-100 overflow-auto">
                { transaction.ids.length === 1 && transaction.ids[0] === 0n && transaction.from === address ? 
                  <>
                  <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 my-2 ms-2">
                    <div className="">
                      Transfer Points 
                    </div> 
                    <div className="">
                      {`${transaction.values[0]} points`}
                    </div> 
                    <div className=""> 
                      {`to address:`}
                    </div>
                  </td>
                  <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 my-2">
                    <div className=""> 
                      { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                    </div>
                    <div className=""> 
                      { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                    </div> 
                    <div className=""> 
                    {`${transaction.to.slice(0,6)}...${transaction.to.slice(38,42)}`}
                    </div> 
                  </td>
                 </>
                 : 
                  transaction.ids.length === 1 && transaction.ids[0] === 0n && transaction.to === address ?
                  <>
                    <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 pt-4 px-2">
                      <div className="">
                        Mint Points  
                      </div> 
                      <div className="">
                        {`${transaction.values[0]} points`}
                      </div> 
                    </td>
                    <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4 px-2">
                      <div> 
                        { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                      </div>
                      <div> 
                        { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                      </div> 
                    </td>
                  </>
                  :
                  transaction.ids.length === 1 && transaction.ids[0] !== 0n && transaction.from === address ?
                  <>
                    <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 pt-4 px-2">
                      <div className="">
                        Transfer Cards  
                      </div> 
                      <div className="">
                        {`Card ID: ${String(transaction.ids[0])}`}
                      </div> 
                    </td>
                    <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4 px-2">
                      <div> 
                        { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                      </div>
                      <div> 
                        { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
                      </div> 
                    </td>
                  </>
                  :
                  transaction.ids.length > 1 ? 
                  <>
                    <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 pt-4 px-2">
                      <div className="">
                        Mint Cards  
                      </div> 
                      <div className="">
                        {`# Cards: ${transaction.ids.length}`}
                      </div> 
                    </td>
                    <td scope="row" className="grow grid grid-cols-1 text-slate-800 dark:text-slate-200 p-4 px-2">
                      <div> 
                        { toFullDateFormat(Number(transaction.blockData.timestamp)) } 
                      </div>
                      <div> 
                        { toEurTimeFormat(Number(transaction.blockData.timestamp)) } 
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
                        {`to customer address: ${transaction.to.slice(0,6)}...${transaction.to.slice(38,42)}`}
                      </div>
                      <div> 
                      {`Card ID: ${transaction.ids}`}
                      </div> 
                    </td>
                    </>
                  }
                </tr>
              )
              }
               </tbody>
            </table>    
          :
          <div className="m-6"> 
              <NoteText message="Transaction history will appear here."/>
          </div>           
          }
          </div> 
          
          {
          modal === 'cards' || modal === 'points' ? 

          <div className="grid grid-cols-1 gap-1 mb-12">
            <div className="px-12 flex h-12">
              <Button onClick={() => {setModal(undefined)} } appearance="grayEmpty">
                <div className="justify-center items-center">
                  Return to Transactions
                </div>
              </Button>
            </div>
          </div>

          :

          <div className="grid grid-cols-1 w-full justify-items-center pb-12">
            <div className="flex w-full md:px-48 px-6">
              <Button onClick={() => {setModal('points')} } appearance="grayEmpty">
                <div className="justify-center items-center">
                  Mint Points
                </div>
              </Button>
            </div>
            <div className="flex w-full md:px-48 px-6">
              <Button onClick={() => {setModal('cards')} } appearance="grayEmpty">
                <div className="justify-center items-center">
                  Mint Cards
                </div>
              </Button>
            </div>
          </div>
      }
    </div> 
  )
}
