"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateModalVisible } from "@/redux/reducers/userInputReducer";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { NotificationDialog } from "../../ui/notificationDialog";
import { useUrlProgramAddress } from "../../hooks/useUrl";
import { useState, useEffect } from "react";
import { 
  EthAddress, 
  LoyaltyProgram, 
  LoyaltyCard 
} from "@/types";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import Image from "next/image";
import { selectLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { resetLoyaltyCard } from "@/redux/reducers/loyaltyCardReducer";
import RequestCard from "./RequestCard";
import SelectLoyaltyCard from "./SelectLoyaltyCard";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { 
  parseEthAddress, 
  parseUri, 
  parseMetadata, 
  parseTransferSingleLogs
} from "@/app/utils/parsers";
import { Button } from "@/app/ui/Button";
import { selectLoyaltyCard } from "@/redux/reducers/loyaltyCardReducer";
import { progAddress } from "@/context/constants";

type ModalProps = {
  children: any;
};

export const ModalMain = ({
  children 
}: ModalProps) => {

  const dispatch = useAppDispatch()
  // const { modalVisible } = useAppSelector(state => state.userInput)
  const [ modalVisible, setModalVisible ] = useState<boolean>(true); 
  const { address }  = useAccount()
  const publicClient = usePublicClient(); 
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const [ userLoggedIn, setUserLoggedIn ] = useState<EthAddress | undefined>() 
  // const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  const [ loyaltyProgram, setLoyaltyProgram ] = useState<LoyaltyProgram>() 
  const [ loyaltyCards, setLoyaltyCards ] = useState<LoyaltyCard[]>() 
  const [ showRequestCard, setShowRequestCard ] = useState<boolean>(false)
  const [ toggleViz, setToggleViz ] = useState<number>(1)
  const visibility = [
    "opacity-100",
    "opacity-0"
  ]

  console.log("toggleViz: ", toggleViz)
  console.log("modalVisible", modalVisible)

  /////////////////////////////////////////////////// 
  /// Loading data loyalty cards owned by address /// 
  ///////////////////////////////////////////////////  

  const getLoyaltyCardIds = async () => {
    // console.log("getLoyaltyCardIds called, address: ", address)

    if (address != undefined) {
      const transferSingleData: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi,
        address: parseEthAddress(progAddress), 
        eventName: 'TransferSingle',
        args: {to: address}, 
        fromBlock: 5200000n
      });
      const transferredTokens = parseTransferSingleLogs(transferSingleData)
      const loyaltyCardData = transferredTokens.filter(token => token.ids[0] != 0n)

      if (loyaltyCardData && progAddress) { 
        const data: LoyaltyCard[] = loyaltyCardData.map(item => { return ({
          cardId: Number(item.ids[0]), 
          loyaltyProgramAddress: parseEthAddress(progAddress)
        })})
        setLoyaltyCards(data) 
      } 
    }

    console.log("loyaltyCards: ", loyaltyCards)
  }

  const getLoyaltyCardData = async () => {
    console.log("getLoyaltyCardAddresses called")

    let loyaltyCard: LoyaltyCard
    let loyaltyCardsUpdated: LoyaltyCard[] = []

    if (loyaltyCards && loyaltyCards.length > 0 ) { 
      try {
        for await (loyaltyCard of loyaltyCards) {

            const cardAddress: unknown = await publicClient.readContract({
              address: parseEthAddress(progAddress), 
              abi: loyaltyProgramAbi,
              functionName: 'getTokenBoundAddress', 
              args: [loyaltyCard.cardId]
            })

            const isOwned: unknown = await publicClient.readContract({
              address: parseEthAddress(progAddress), 
              abi: loyaltyProgramAbi,
              functionName: 'balanceOf', 
              args: [address, loyaltyCard.cardId]
            })

            isOwned ? loyaltyCardsUpdated.push({...loyaltyCard, cardAddress: parseEthAddress(cardAddress)}) : null 

          }
          setLoyaltyCards(loyaltyCardsUpdated)

        } catch (error) {
          console.log(error)
      }
    }
  }

  useEffect(() => {
    if (!loyaltyCards ) { getLoyaltyCardIds() } // check when address has no cards what happens..  
    if (
      loyaltyCards && 
      loyaltyCards.findIndex(loyaltyCard => loyaltyCard.cardAddress) === -1 
      ) { 
        getLoyaltyCardData() 
      } 
  }, [ , loyaltyCards, address])

  useEffect(() => {
    if (loyaltyCards) { setLoyaltyCards(undefined) } 
  }, [ address ])

  useEffect(() => {
    if (
      loyaltyCards && 
      loyaltyCards.length == 1 
      ) { dispatch(selectLoyaltyCard(loyaltyCards[0])) } 
  }, [, loyaltyCards, address])


  ///////////////////////////////////////////// 
  /// Loading data selected loyalty Program /// 
  ///////////////////////////////////////////// 

  // console.log("loyaltyProgram UPDATES: ", loyaltyProgram)

  const getLoyaltyProgramUri = async () => {
    console.log("getLoyaltyProgramsUris called. ProgAddress:", progAddress)

    if (progAddress) {

      try { 
        const uri: unknown = await publicClient.readContract({
          address: parseEthAddress(progAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'uri',
          args: [0]
        })

        setLoyaltyProgram({...loyaltyProgram, programAddress: parseEthAddress(progAddress), uri: parseUri(uri)})
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getLoyaltyProgramOwner = async () => {
    // console.log("getLoyaltyProgramOwner called. ProgAddress:", progAddress)

    if (progAddress) {

      try { 
        const owner: unknown = await publicClient.readContract({
          address: parseEthAddress(progAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'getOwner'
        })

        console.log("getLoyaltyProgramOwner: ", owner)

        setLoyaltyProgram({...loyaltyProgram, programAddress: parseEthAddress(progAddress), programOwner: parseEthAddress(owner)})
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getLoyaltyProgramMetaData = async () => {
    // console.log("getLoyaltyProgramMetaData called. ProgAddress:", progAddress )

    if (loyaltyProgram) {
      try {
          const fetchedMetadata: unknown = await(
            await fetch(parseUri(loyaltyProgram?.uri))
            ).json()
            
            setLoyaltyProgram({...loyaltyProgram, metadata: parseMetadata(fetchedMetadata)})
          
        } catch (error) {
          console.log(error)
      }
    }
  }

  useEffect(() => {

    if (!loyaltyProgram ) { getLoyaltyProgramUri() } // check when address has no deployed programs what happens..  
    if (
      loyaltyProgram && 
      !loyaltyProgram.metadata  
      ) { getLoyaltyProgramMetaData() } 
    if (
      loyaltyProgram && 
      !loyaltyProgram.programOwner 
      ) { getLoyaltyProgramOwner() }
    if (
      loyaltyProgram 
      ) { dispatch(selectLoyaltyProgram(loyaltyProgram))}
  
  }, [, progAddress, loyaltyProgram, showRequestCard])

  console.log("loyaltyProgram data: ", loyaltyProgram)

  useEffect(() => {
    if (address != userLoggedIn) {
      setUserLoggedIn(undefined)
      setLoyaltyProgram(undefined)
      dispatch(resetLoyaltyCard(true))
    }

    if (!address) {
      dispatch(notification({
        id: "NotLoggedIn",
        message: "You are not connected to a network.", 
        colour: "red",
        loginButton: true, 
        isVisible: true
      }))
      setUserLoggedIn(undefined)
    }    
    
    if (address) {
      dispatch(updateNotificationVisibility({
        id: "NotLoggedIn",
        isVisible: false
      }))
      setUserLoggedIn(address)
    }

  }, [ , address])

  useEffect(() => {
    
    if (modalVisible == true)  { setToggleViz(0) } 
    else { setToggleViz(1) }  

  }, [modalVisible])

  console.log(
    "pre render console log", 
    "selectedLoyaltyCard: ", selectedLoyaltyCard, 
    "loyaltyCards: ", loyaltyCards
  )

  return (
    <div className="relative grow w-full h-full max-w-4xl z-1">

      <div className="flex flex-col pt-14 h-full z-3">
        { selectedLoyaltyProgram?.metadata ? 
          <Image
          className="absolute inset-0 z-0"
          fill 
          style = {{ objectFit: "cover" }} 
          src={selectedLoyaltyProgram.metadata.imageUri} 
          alt="Loyalty Card Token"
          />
        : null }        
        <NotificationDialog/> 

        <div className="flex flex-col h-full justify-end mt-2 z-10"> 
          <div 
            className="h-full aria-disabled:h-24 flex flex-col justify-center mx-2 backdrop-blur-xl transition:all ease-in-out duration-300 overflow-x-auto shadow-2xl bg-slate-200/[.90] dark:bg-slate-800/[.90] rounded-t-lg" 
            aria-disabled={modalVisible}>
                <button 
                  className="grow-0 z-5 flex justify-center text-slate-800 dark:text-slate-200 font-bold pt-2 px-2"
                  type="submit"
                  onClick={() => setModalVisible(!modalVisible)} // should be true / false
                  >
                    {modalVisible ? 
                      <ChevronUpIcon
                        className="h-7 w-7 m-2"
                        aria-hidden="true"
                      />
                      :
                      <ChevronDownIcon
                        className="h-7 w-7 m-2" 
                        aria-hidden="true"
                      />
                    }
                </button>
              <div
                className="grow aria-disabled:grow-0 aria-disabled:h-12 h-96 z-0 scroll-auto overflow-x-auto transition:all ease-in-out duration-300 delay-100"
                aria-disabled={modalVisible}
                >
                  { 
                    selectedLoyaltyCard ? 
                    children 
                    :
                    loyaltyCards && loyaltyCards.length == 0 ?
                      <RequestCard /> 
                    : 
                    showRequestCard ?
                      <div className="grid grid-cols-1 h-full content-between mb-12">
                        <RequestCard /> 
                        <div className="flex md:px-48 px-6">
                          <Button onClick={() => setShowRequestCard(false)} appearance="grayEmpty">
                            Return to select card
                          </Button>
                        </div> 
                        <div className="h-16"/> 
                      </div>
                    : 
                    loyaltyCards && loyaltyCards.length >= 1  ? // selectedLoyaltyCard 
                      <div className="grid grid-cols-1 h-full content-between mb-12">
                        <SelectLoyaltyCard loyaltyCards = {loyaltyCards}/> 
                        <div className="flex md:px-48 px-6">

                          <Button onClick={() => setShowRequestCard(true)} appearance="grayEmpty">
                            Request new Card
                          </Button>
                        </div> 
                        <div className="h-16"/> 
                      </div>
                    :
                    <div> Something went wrong, no loyalty card selected. </div> 
                  }
              </div>
              </div>
          </div>
      </div>
  </div> 
)};

