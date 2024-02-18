"use client"; 

import { TitleText } from "@/app/ui/StandardisedFonts";
import { Button } from "@/app/ui/Button";
import { useState } from "react";
import { Status, Transaction } from "@/types";
import { Log } from "viem";
import { parseEthAddress, parseTransferSingleLogs, parseTransferBatchLogs, parseBigInt } from "@/app/utils/parsers";
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
import MintPoints from "../components/MintPoints";
import MintCards from "../components/MintCards";
import { useAppSelector } from "@/redux/hooks";

export default function Page() {
  const [modal, setModal] = useState<'points' | 'cards' | undefined>()  
  const [loyaltyPoints, setLoyaltyPoints] = useState<Number>()
  const [cardsMinted, setCardsMinted] = useState<Number>()
  const { progAddress } =  useUrlProgramAddress();
  const publicClient = usePublicClient(); 
  const { address } = useAccount() 
  const [ status, setStatus ] = useState<Status>('isIdle'); 
  const [transactions, setTransactions] = useState<Transaction[] | undefined >()
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )

  console.log("selectedLoyaltyProgram: ", selectedLoyaltyProgram)

  const getLoyaltyProgramPoints = async () => {
    console.log("getLoyaltyProgramPoints called")
      if (selectedLoyaltyProgram) {
      const loyaltyProgramPointsData = await publicClient.readContract({
        address: parseEthAddress(selectedLoyaltyProgram.programAddress), 
        abi: loyaltyProgramAbi,
        functionName: 'balanceOf', 
        args: [ selectedLoyaltyProgram.programOwner, 0 ]
      });
      console.log("loyaltyProgramPointsData: ", loyaltyProgramPointsData)
      
      const loyaltyCardPoints = parseBigInt(loyaltyProgramPointsData)
      setLoyaltyPoints(Number(loyaltyCardPoints))
    }
  }

  const getLoyaltyProgramCardsMinted = async () => {
    console.log("getLoyaltyProgramCardsMinted called")
      if (selectedLoyaltyProgram) {
      const loyaltyCardsData = await publicClient.readContract({
        address: parseEthAddress(selectedLoyaltyProgram.programAddress), 
        abi: loyaltyProgramAbi,
        functionName: 'getNumberLoyaltyCardsMinted', 
        args: []
      });

      console.log("loyaltyCardsData: ", loyaltyCardsData)
      
      const loyaltyCards = parseBigInt(loyaltyCardsData)

      if (transactions) {
        const transferredCards = transactions.filter(transaction => 
          transaction.ids[0] != 0n 
        )
        console.log("transferredCards: ", transferredCards)

        transferredCards ? setCardsMinted(Number(loyaltyCards) - Number(transferredCards.length)) : setCardsMinted(Number(loyaltyCards))
      }
    }
  }

  const getTransactions = async () => {
    console.log("getTransactions called")

    const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle', 
      args: {
        from: parseEthAddress(address)
      },
      fromBlock: 5200000n
    });
    const transferSingleData =  parseTransferSingleLogs(transferSingleLogs)

    const transferMintPointsLogs: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle', 
      args: {
        to: parseEthAddress(address)
      },
      fromBlock: 5200000n
    });
    const transferMintPointsData =  parseTransferSingleLogs(transferMintPointsLogs)

    const transferMintCardLogs: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'TransferBatch', 
      args: {
        to: parseEthAddress(address)
      },
      fromBlock: 5200000n
    });
    console.log("transferMintCardLogs: ", transferMintCardLogs)
    const transferMintCardData =  parseTransferBatchLogs(transferMintCardLogs)

    const transferData = [...transferSingleData, ...transferMintPointsData, ...transferMintCardData]
    transferData.sort((firstTransaction, secondTransaction) => 
      Number(secondTransaction.blockNumber) - Number(firstTransaction.blockNumber));

    setTransactions(transferData)
    setStatus("isSuccess")
    console.log("transferData: ", transferData)
  }



  useEffect(() => {
    setStatus('isLoading')
    getTransactions()
    if (status == "isSuccess")  {
      setStatus("isLoading")
      getLoyaltyProgramPoints() 
      getLoyaltyProgramCardsMinted()
    }
    setStatus("isIdle")
  }, [ , modal, selectedLoyaltyProgram, status])


  return (
    <div className="grid grid-cols-1 h-full w-full justify-items-between content-between">

      <div className="grid grid-cols-1 justify-items-center w-full h-full overflow-auto ">
        <TitleText title = "Transaction Overview" subtitle="See transactions, mint loyalty points and cards." size = {2} />
        <div className="grid grid-cols-1 p-2 pt-3 w-5/6 sm:w-2/3 text-center justify-items-center border-b border-slate-700"> 
          <p> {`${loyaltyPoints}`} points | {`${cardsMinted}`} cards </p> 
        </div>

        { 
          modal === 'points' ? 
            <div className="p-3 px-4 grid grid-cols-1 h-full">
              <MintPoints modal = {modal} setModal = {setModal} /> 
            </div>
        :
          modal === 'cards' ? 
            <div> 
              <MintCards modal = {modal} setModal = {setModal} /> 
            </div>
        : 
          transactions ? 
            <div className="grid grid-cols-1 overflow-auto w-full md:w-4/5 m-1 mx-3 p-6 divide-y">  
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
                        {`to loyalty card address: ${transaction.to.slice(0,6)}...${transaction.to.slice(38,42)}`}
                      </div>
                      <div> 
                        {`${transaction.values[0]} points`}
                      </div>
                    </div>
                  :
                  transaction.ids.length === 1 && transaction.ids[0] === 0n && transaction.to === address ?
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
                      {`to loyalty card address: ${transaction.to.slice(0,6)}...${transaction.to.slice(38,42)}`}
                    </div>
                    <div> 
                      {`${transaction.values[0]} points`}
                    </div>
                  </div>
                  : 
                  transaction.ids.length === 1 && transaction.ids[0] !== 0n && transaction.from === address ?
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
                        {`to customer address: ${transaction.to.slice(0,6)}...${transaction.to.slice(38,42)}`}
                      </div>
                      <div> 
                        {`Card ID: ${String(transaction.ids[0])}`}
                </div>
                    </div>
                  :
                  transaction.ids.length > 1 ? 
                    <div className="grid grid-cols-1">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          Mint Loyalty Cards 
                        </div> 
                        <div className="">
                          Blocknumber: {Number(transaction.blockNumber)}
                        </div> 
                      </div>
                      <div> 
                        {`to customer address: ${transaction.to.slice(0,6)}...${transaction.to.slice(38,42)}`}
                      </div>
                      <div> 
                        {`number Cards minted ${transaction.ids.length}`}
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
          
          {
          modal === 'cards' || modal === 'points' ? 

          <div className="grid grid-cols-1 gap-1 mb-12">
            <div className="px-12 flex h-12">
              <Button onClick={() => {setModal(undefined)} } appearance="grayEmpty">
                <div className="justify-center items-center">
                  Return to Transaction Overview
                </div>
              </Button>
            </div>
          </div>

          :

          <div className="grid grid-cols-1 w-full justify-items-center pb-12">
            <div className="flex w-full md:px-48 px-6">
              <Button onClick={() => {setModal('points')} } appearance="grayEmpty">
                <div className="justify-center items-center">
                  Mint Loyalty Points
                </div>
              </Button>
            </div>
            <div className="flex w-full md:px-48 px-6">
              <Button onClick={() => {setModal('cards')} } appearance="grayEmpty">
                <div className="justify-center items-center">
                  Mint Loyalty Cards
                </div>
              </Button>
            </div>
          </div>
      }
      {/* <div className="pb-6" /> */}
      
    </div> 
  )
}
