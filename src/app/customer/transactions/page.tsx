"use client"; 

import { TitleText } from "@/app/ui/StandardisedFonts";
import { Button } from "@/app/ui/Button";
import { useState } from "react";
import { Transaction } from "@/types";
import { Log } from "viem";
import { 
  parseEthAddress, 
  parseTransferSingleLogs, 
  parseTransferBatchLogs, 
  parseBigInt
} from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { 
  useAccount, 
  usePublicClient 
} from "wagmi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { NoteText } from "@/app/ui/StandardisedFonts";
import { useAppSelector } from "@/redux/hooks";


export default function Page() {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const {selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>() 
  const { progAddress } =  useUrlProgramAddress();
  const publicClient = usePublicClient(); 
  const { address } = useAccount() 
  const [transactions, setTransactions] = useState<Transaction[]>()

  const getLoyaltyCardPoints = async () => {
    console.log("getLoyaltyCardPoints called")
      if (selectedLoyaltyCard) {
      const loyaltyCardPointsData = await publicClient.readContract({
        address: parseEthAddress(progAddress), 
        abi: loyaltyProgramAbi,
        functionName: 'getBalanceLoyaltyCard', 
        args: [ selectedLoyaltyCard?.cardAddress ]
      });
      const loyaltyCardPoints = parseBigInt(loyaltyCardPointsData)
      setLoyaltyPoints(Number(loyaltyCardPoints))
    }
  }

  const getTransactionsTo = async () => {
    console.log("getTransactionsTo called")

    const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle', 
      args: {
        to: selectedLoyaltyCard?.cardAddress
      },
      fromBlock: 1n,
      toBlock: 16330050n
    });
    const transferSingleData =  parseTransferSingleLogs(transferSingleLogs)
    console.log("transferSingleData TO:" , transferSingleData)

    // here more data can be added later (claiming & redeeming tokens for instance)
    const transferData = [...transferSingleData] 
    transferData.sort((firstTransaction, secondTransaction) => 
      Number(secondTransaction.blockNumber) - Number(firstTransaction.blockNumber));

    setTransactions(transferData)
    console.log("transferData: ", transferData)
  }

  const getTransactionsFrom = async () => {
    console.log("getTransactionsFrom called")

    const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle', 
      args: {
        from: selectedLoyaltyCard?.cardAddress
      },
      fromBlock: 1n,
      toBlock: 16330050n
    });
    const transferSingleData =  parseTransferSingleLogs(transferSingleLogs)
    console.log("transferSingleData FROM:" , transferSingleData)
    
    const transferData = [...transferSingleData, transactions] 
    // transferData.sort((firstTransaction, secondTransaction) => 
    //   Number(secondTransaction.blockNumber) - Number(firstTransaction.blockNumber));

    // setTransactions(transferData)
    console.log("transferData: ", transferData)
  }

  useEffect(() => {
    getTransactionsTo()
    getTransactionsFrom()
    getLoyaltyCardPoints()
  }, [ ])

  return (
    <div className="grid grid-cols-1 h-full content-between">
      <div className="grid grid-cols-1 h-full overflow-auto px-2 justify-items-center">
        <TitleText title = "Transaction Overview" subtitle="See transactions, mint loyalty points and cards." size = {2} />

        {/* <div className="flex justify-center"> 
          <p className="p-2 w-1/2 text-center border-b border-blue-800">
            {`${loyaltyPoints} loyalty points remaining`}
          </p>
        </div> */}

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
                          Received Points 
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
