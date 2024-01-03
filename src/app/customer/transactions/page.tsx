"use client"; 

import { TitleText } from "@/app/ui/StandardisedFonts";
import { Button } from "@/app/ui/Button";
import { useState } from "react";
import { Transaction } from "@/types";
import { Log } from "viem";
import { parseEthAddress, parseTransferSingleLogs, parseTransferBatchLogs } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { 
  useAccount, 
  usePublicClient 
} from "wagmi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { NoteText } from "@/app/ui/StandardisedFonts";

export default function Page() {
  const { progAddress } =  useUrlProgramAddress();
  const publicClient = usePublicClient(); 
  const { address } = useAccount() 
  const [transactions, setTransactions] = useState<Transaction[] | undefined >()

  const getTransactions = async () => {
    console.log("getTransactions called")

    const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle', 
      args: {
        to: parseEthAddress(address)
      },
      fromBlock: 1n,
      toBlock: 16330050n
    });
    const transferSingleData =  parseTransferSingleLogs(transferSingleLogs)

    // here more data can be added later (claiming & redeeming tokens for instance)
    const transferData = [...transferSingleData] 
    transferData.sort((firstTransaction, secondTransaction) => 
      Number(secondTransaction.blockNumber) - Number(firstTransaction.blockNumber));

    setTransactions(transferData)
    console.log("transferData: ", transferData)
  }

  useEffect(() => {
    getTransactions()
  }, [ ])

  return (
    <div className="grid grid-cols-1 h-full content-between">
      <div className="grid grid-cols-1 h-full overflow-auto ">
        <TitleText title = "Transaction Overview" subtitle="See transactions, mint loyalty points and cards." size = {2} />

        { transactions ? 
            <div className="grid grid-cols-1 overflow-auto m-4 mx-12 p-8 divide-y">  
              {
              transactions.map((transaction: Transaction, i) => 
                <div key = {i} className="p-2 ">
                  {
                   transaction.ids.length === 1 && transaction.ids[0] === 0n && transaction.from === address ? 
                    <div className="grid grid-cols-1">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          Transfer Points 
                        </div> 
                        <div className="">
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </div>
                      <div> 
                        {`to loyalty card address: ${transaction.to}`}
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
