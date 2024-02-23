"use client";

// This page needs a good clean up... 

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { NotificationDialog } from "../../ui/notificationDialog";
import { useState, useEffect, Suspense, useRef } from "react";
import { 
  EthAddress, 
  LoyaltyProgram, 
  LoyaltyCard 
} from "@/types";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import Image from "next/image";
import { resetLoyaltyCard } from "@/redux/reducers/loyaltyCardReducer";
import RequestCard from "./RequestCard";
import SelectLoyaltyCard from "./SelectLoyaltyCard";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { 
  parseEthAddress, 
  parseTransferSingleLogs
} from "@/app/utils/parsers";
import { Button } from "@/app/ui/Button";
import { selectLoyaltyCard } from "@/redux/reducers/loyaltyCardReducer";
import { useLoyaltyPrograms } from "@/app/hooks/useLoyaltyPrograms";
import { selectLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import NavbarTop from "./NavbarTop";
import NavbarBottom from "./NavbarBottom";
import { updateModalVisible } from "@/redux/reducers/userInputReducer";
import { useLoyaltyCards } from "@/app/hooks/useLoyaltyCards";

type ModalProps = {
  children: any;
};

export const DynamicLayout = ({
  children 
}: ModalProps) => {
  const { address }  = useAccount()
  const [ userLoggedIn, setUserLoggedIn ] = useState<EthAddress | undefined>() 
  
  const dispatch = useAppDispatch()
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { modalVisible } = useAppSelector(state => state.userInput )

  const { status: statusUseLoyaltyPrograms, loyaltyPrograms, fetchPrograms } = useLoyaltyPrograms()
  const { status: statusUseLoyaltyCards, loyaltyCards, fetchCards } = useLoyaltyCards ()

  console.log("statusUseLoyaltyPrograms: ", statusUseLoyaltyPrograms)
  console.log("statusUseLoyaltyCards: ", statusUseLoyaltyCards)

  useEffect(() => {
    if (
      address &&
      selectedLoyaltyProgram && 
      statusUseLoyaltyPrograms == "isIdle"
      ) fetchPrograms([selectedLoyaltyProgram]) 
  }, [ , selectedLoyaltyProgram, address ])

  useEffect(() => {
    if (
      statusUseLoyaltyPrograms == "isSuccess" && 
      loyaltyPrograms
    ) dispatch(selectLoyaltyProgram(loyaltyPrograms[0]))
  }, [loyaltyPrograms])

  useEffect(() => {
    if (
      statusUseLoyaltyPrograms == "isSuccess" && 
      statusUseLoyaltyCards == "isIdle" && 
      address && 
      selectedLoyaltyProgram?.programAddress
      ) fetchCards({userAddress: address, programAddress: selectedLoyaltyProgram?.programAddress}) 
  }, [ statusUseLoyaltyPrograms, statusUseLoyaltyCards, address, selectedLoyaltyProgram ])

  useEffect(() => {
    if (
      statusUseLoyaltyCards == "isSuccess" && 
      loyaltyCards && 
      loyaltyCards.length == 1 
      ) { dispatch(selectLoyaltyCard(loyaltyCards[0])) } 
  }, [, loyaltyCards, address])

  // useEffect(() => { 
  //   if (
  //     loyaltyPrograms && 
  //     loyaltyPrograms[0].metadata != undefined
  //     )  dispatch(selectLoyaltyProgram(loyaltyPrograms[0]))
  // }, [loyaltyPrograms])

  // this is a bug - does nto seem to work. fix £todo 
  // useEffect(() => {
  //   if (selectedLoyaltyProgram && status == "isSuccess" && loyaltyPrograms) dispatch(selectLoyaltyProgram(loyaltyPrograms[0]))
  // }, [selectedLoyaltyProgram, status, loyaltyPrograms, userLoggedIn ])

  // useEffect(() => {
  //   if (!loyaltyCards && address && selectedLoyaltyProgram) fetchCards({
  //     userAddress: parseEthAddress(address), 
  //     programAddress: parseEthAddress(selectedLoyaltyProgram.programAddress)
  //   })  
  // }, [, loyaltyCards, address, selectedLoyaltyProgram])

// this should 
  useEffect(() => {
    if (!selectedLoyaltyProgram) dispatch(updateModalVisible(false))
// and here needs to be a notifation with link to landing page. £todo

  }, [selectedLoyaltyProgram])

  useEffect(() => {
    // if (address != userLoggedIn) {
    //   setUserLoggedIn(undefined)
    //   dispatch(resetLoyaltyCard(true))
    // }

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

  console.log(
    "pre render console log", 
    "selectedLoyaltyProgram: ", selectedLoyaltyProgram, 
    "address", address, 
    "loyaltyCards: ", loyaltyCards, 
    "selectedLoyaltyCard: ", selectedLoyaltyCard  
  )

  return (
    <>
    <NavbarTop/>
      <div className="grow justify-center w-full h-full max-w-4xl overflow-y-scroll">

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
        : 
          null 
      }        
        <NotificationDialog/> 

        <div className="flex flex-col h-full justify-end mt-2 z-10"> 
          <div 
            className="h-full aria-disabled:h-24 flex flex-col justify-center mx-2 backdrop-blur-xl transition:all ease-in-out duration-300 overflow-x-auto shadow-2xl bg-slate-200/[.90] dark:bg-slate-800/[.90] rounded-t-lg" 
            aria-disabled={modalVisible}>
                <button 
                  className="grow-0 z-5 flex justify-center text-slate-800 dark:text-slate-200 font-bold pt-2 px-2"
                  type="submit"
                  onClick={() => dispatch(updateModalVisible(!modalVisible))} // should be true / false
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
                    loyaltyCards && loyaltyCards.length >= 1 && !selectedLoyaltyCard ? 
                      <div className="grid grid-cols-1 h-full content-between mb-12">
                        <SelectLoyaltyCard loyaltyCards = {loyaltyCards}/> 
                        <div className="h-16"/> 
                      </div>
                    :
                    <div className="grid grid-cols-1 w-full h-full justify-items-center content-center text-slate-200 "> 
                      <Image
                        className="rounded-lg mx-3 animate-spin"
                        width={30}
                        height={30}
                        src={"/images/loading2.svg"}
                        alt="Loading icon"
                      />
                    </div> 
                  }
              </div>
              </div>
          </div>
      </div>
    </div>
    <NavbarBottom/>
  </div>
  </>
)};

/////////////////////////


  // const getLoyaltyCardIds = async () => {
  //   if (address != undefined && selectedLoyaltyProgram ) {
  //     const transferSingleData: Log[] = await publicClient.getContractEvents( { 
  //       abi: loyaltyProgramAbi,
  //       address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
  //       eventName: 'TransferSingle',
  //       args: {to: address}, 
  //       fromBlock: 5200000n
  //     });
  //     const transferredTokens = parseTransferSingleLogs(transferSingleData)
  //     const loyaltyCardData = transferredTokens.filter(token => token.ids[0] != 0n)

  //     if (loyaltyCardData && selectedLoyaltyProgram?.programAddress) { 
  //       const data: LoyaltyCard[] = loyaltyCardData.map(item => { return ({
  //         cardId: Number(item.ids[0]), 
  //         loyaltyProgramAddress: parseEthAddress(selectedLoyaltyProgram?.programAddress)
  //       })})
  //       setLoyaltyCards(data) 
  //     } 
  //   }

  //   console.log("loyaltyCards: ", loyaltyCards)
  // }

  // // CHECK BALANCE (if address still owns loyalty Cards!)

  // const getLoyaltyCardData = async () => {
  //   console.log("getLoyaltyCardAddresses called")

  //   let loyaltyCard: LoyaltyCard
  //   let loyaltyCardsUpdated: LoyaltyCard[] = []

  //   if (loyaltyCards && loyaltyCards.length > 0  && selectedLoyaltyProgram ) { 
  //     try {
  //       for await (loyaltyCard of loyaltyCards) {

  //           const cardAddress: unknown = await publicClient.readContract({
  //             address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
  //             abi: loyaltyProgramAbi,
  //             functionName: 'getTokenBoundAddress', 
  //             args: [loyaltyCard.cardId]
  //           })

  //           const isOwned: unknown = await publicClient.readContract({
  //             address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
  //             abi: loyaltyProgramAbi,
  //             functionName: 'balanceOf', 
  //             args: [address, loyaltyCard.cardId]
  //           })

  //           isOwned ? loyaltyCardsUpdated.push({...loyaltyCard, cardAddress: parseEthAddress(cardAddress)}) : null 

  //         }
  //         setLoyaltyCards(loyaltyCardsUpdated)

  //       } catch (error) {
  //         console.log(error)
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (!loyaltyCards && selectedLoyaltyProgram) { getLoyaltyCardIds() } // check when address has no cards what happens..  
  //   if (
  //     loyaltyCards && 
  //     loyaltyCards.findIndex(loyaltyCard => loyaltyCard.cardAddress) === -1 
  //     ) { 
  //       getLoyaltyCardData() 
  //     } 
  // }, [ , loyaltyCards, selectedLoyaltyProgram ])

  // useEffect(() => {
  //   if (loyaltyCards) { setLoyaltyCards(undefined) } 
  // }, [ address ])
