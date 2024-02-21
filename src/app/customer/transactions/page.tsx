"use client"; 

import { TitleText } from "@/app/ui/StandardisedFonts";
import { Button } from "@/app/ui/Button";
import { useRef, useState } from "react";
import { Transaction, Status } from "@/types";
import { Log } from "viem";
import { 
  parseEthAddress, 
  parseTransferSingleLogs, 
  parseTransferBatchLogs, 
  parseBigInt
} from "@/app/utils/parsers";
import { loyaltyProgramAbi, loyaltyGiftAbi } from "@/context/abi";
import dynamic from 'next/dynamic'

import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { 
  useAccount, 
  usePublicClient 
} from "wagmi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { NoteText } from "@/app/ui/StandardisedFonts";
import { useAppSelector } from "@/redux/hooks";
 


type OverviewTransactionProps = {
  transactionsPointsTo: Transaction[]; 
  transactionsPointsFrom: Transaction[]; 
  transactionsTokensTo: Transaction[]; 
  transactionsTokensFrom: Transaction[]; 
}

type OverviewStatusProps = {
  transactionsPointsTo: Status; 
  transactionsPointsFrom: Status; 
  transactionsTokensTo: Status; 
  transactionsTokensFrom: Status; 
}

export default function Page() {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const {selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram)
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const publicClient = usePublicClient(); 

  const [ transactions, setTransactions ] = useState<Transaction[]>([]) 
  const [transactionsPointsTo, setTransactionsPointsTo] = useState<Transaction[]>([]) 
  const [transactionsPointsFrom, setTransactionsPointsFrom] = useState<Transaction[]>([])  
  const [transactionsTokensTo, setTransactionsTokensTo] = useState<Transaction[]>([]) 
  const [transactionsTokensFrom, setTransactionsTokensFrom] = useState<Transaction[]>([])  

  console.log("transactions: ", transactions)

  const getTransactionsTo = async () => {

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
    setTransactionsPointsTo([...transactions])
  }

  const getTransactionsFrom = async () => {

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
  }

  const getTokensTo = async () => {
   
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
  }
  
  const getTokensFrom = async () => {

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
      transactionsTokensFrom) {
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

  return (
    <div className="grid grid-cols-1 h-full content-between">
      <div className="grid grid-cols-1 h-full overflow-auto px-2 justify-items-center">
        <TitleText title = "Transaction Overview" subtitle="See transactions, mint loyalty points and cards." size = {2} />

        { transactions ? 
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
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </div>
                      <div> 
                        {`${transaction.values[0]} points`}
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
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </div>
                      <div> 
                        {`${transaction.values[0]} points`}
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
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </div>
                      <div> 
                        {`Voucher Id: ${transaction.values[0]}`}
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
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </div>
                      <div> 
                        {`Voucher Id: ${transaction.values[0]}`}
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
