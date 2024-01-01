"use client"; 

import { TitleText } from "@/app/ui/StandardisedFonts";
import { InputForm } from "../../components/InputForm";
import { Button } from "@/app/ui/Button";
import { useState } from "react";
import { Transaction } from "@/types";
import { Log } from "viem";
import { parseEthAddress, parseTransactionLogs } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { 
  useContractWrite, 
  useWaitForTransaction, 
  useAccount, 
  useContractRead, 
  usePublicClient 
} from "wagmi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { NoteText } from "@/app/ui/StandardisedFonts";
import MintPoints from "./mintPoints";

export default function Page() {
  const [modal, setModal] = useState<'points' | 'cards' | undefined>()  
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
        from: parseEthAddress(address)
      },
      fromBlock: 1n,
      toBlock: 16330050n
    });
    const transferSingleData =  parseTransactionLogs(transferSingleLogs)

    const transferMintLogs: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle', 
      args: {
        // from: parseEthAddress(progAddress), 
        // to: parseEthAddress(progAddress)
      },
      fromBlock: 1n,
      toBlock: 16330050n
    });
    const transferMintData =  parseTransactionLogs(transferMintLogs)

    const transferData = [...transferSingleData, ...transferMintData]
    transferData.sort((firstTransaction, secondTransaction) => 
      Number(secondTransaction.blockNumber) - Number(firstTransaction.blockNumber));

    setTransactions(transferData)
    console.log("transferData: ", transferData)
  }

  useEffect(() => {
    getTransactions()
  }, [, modal])


  return (
    <div className="grid grid-cols-1 h-full content-between">

      <div className="grid grid-cols-1 h-full overflow-auto ">
        <TitleText title = "Transaction Overview" subtitle="See transactions, mint loyalty points and cards." size = {2} />

        { 
        
        modal === 'points' ? 
        
          <div className="p-3 px-12 grid grid-cols-1 h-full ">

            <MintPoints modal = {modal} setModal = {setModal} /> 

          </div>

        :

        modal === 'cards' ? 

          <div> 

            cards

          </div>

        : 

          transactions ? 
            <div className="grid grid-cols-1 overflow-auto m-4 mx-12 p-8 divide-y">  
              {
              transactions.map((transaction: Transaction, i) => 
                <div key = {i} className="p-2 ">
                  {
                  transaction.id === 0n && transaction.from === address ? 
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
                        {`${transaction.value} points`}
                      </div>
                    </div>
                  :
                  transaction.id === 0n && transaction.to === address ?
                    <div className="grid grid-cols-1">
                    <div className="flex justify-between">
                      <div className="font-bold">
                        Mint Points 
                      </div> 
                      <div className="">
                        Blocknumber: {Number(transaction.blockNumber)}
                      </div> 
                    </div>
                    <div> 
                      {`to loyalty card address: ${transaction.to}`}
                    </div>
                    <div> 
                      {`${transaction.value} points`}
                    </div>
                  </div>
                  : 
                  transaction.id !== 0n && transaction.from === address ?
                    <div className="grid grid-cols-1">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          Transfer Loyalty Card 
                        </div> 
                        <div className="">
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </div>
                      <div> 
                        {`to customer address: ${transaction.to}`}
                      </div>
                      <div> 
                        {`Card ID: ${transaction.id}`}
                      </div>
                    </div>
                  :
                    <div className="grid grid-cols-1">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          Mint Loyalty Card 
                        </div> 
                        <div className="">
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </div>
                      <div> 
                        {`to customer address: ${transaction.to}`}
                      </div>
                      <div> 
                        {`Card ID: ${transaction.id}`}
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
          
          {
          modal === 'cards' || modal === 'points' ? 

          <div className="grid grid-cols-1 gap-1 mb-12">
            <div className="px-12 flex h-12">
              <Button onClick={() => {setModal(undefined)} } appearance="blueEmpty">
                <div className="justify-center items-center">
                  Return to Transaction Overview
                </div>
              </Button>
            </div>
          </div>

          :

          <div className="grid grid-cols-1 gap-1 mb-12">
            <div className="px-12 flex h-12">
              <Button onClick={() => {setModal('points')} } appearance="blueFilled">
                <div className="justify-center items-center">
                  Mint Loyalty Points
                </div>
              </Button>
            </div>
            <div className="px-12 mb-12 flex h-12">
              <Button onClick={() => {setModal('cards')} } appearance="blueFilled">
                <div className="justify-center items-center">
                  Mint Loyalty Cards
                </div>
              </Button>
            </div>
          </div>
      }
      
    </div> 
  )
}
