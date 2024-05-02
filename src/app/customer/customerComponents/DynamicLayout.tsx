"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { NotificationDialog } from "../../ui/notificationDialog";
import { useState, useEffect} from "react";
import { EthAddress } from "@/types";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import Image from "next/image";
import RequestCard from "./RequestCard";
import SelectLoyaltyCard from "./SelectLoyaltyCard";
import { useAccount } from 'wagmi'
import { parseEthAddress } from "@/app/utils/parsers";
import { selectLoyaltyCard } from "@/redux/reducers/loyaltyCardReducer";
import { useLoyaltyPrograms } from "@/app/hooks/useLoyaltyPrograms";
import { selectLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
// import NavbarTop from "./NavbarTop";
// import NavbarBottom from "../../components/NavbarBottom";
import { updateModalVisible } from "@/redux/reducers/userInputReducer";
import { useLoyaltyCards } from "@/app/hooks/useLoyaltyCards";

type ModalProps = {
  children: any;
};

export const DynamicLayout = ({
  children 
}: ModalProps) => {
  const { address, chain, status }  = useAccount()
  const [ userLoggedIn, setUserLoggedIn ] = useState<EthAddress | undefined>() 
  
  const dispatch = useAppDispatch()
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { modalVisible } = useAppSelector(state => state.userInput )

  const { status: statusUseLoyaltyPrograms, loyaltyPrograms, fetchPrograms } = useLoyaltyPrograms()
  const { status: statusUseLoyaltyCards, loyaltyCards, fetchCards } = useLoyaltyCards ()

  useEffect(() => {
    const progAddress = localStorage.getItem("progAddress") || ""
    if (
      address &&
      statusUseLoyaltyPrograms == "isIdle"
      ) fetchPrograms([{programAddress: parseEthAddress(progAddress)}]) 
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

  useEffect(() => {
    if (!selectedLoyaltyProgram) dispatch(updateModalVisible(false))
// and here needs to be a notifation with link to landing page. £todo

  }, [selectedLoyaltyProgram])

  useEffect(() => {
    if (status === "disconnected") {
      dispatch(notification({
        id: "notConnected",
        message: "You are not connected to a network.", 
        colour: "red",
        loginButton: true, 
        isVisible: true
      }))
      dispatch(updateModalVisible(false))
      setUserLoggedIn(undefined)
    }

    if (status === "connecting") {
      dispatch(notification({
        id: "notConnected",
        message: "Connecting... One moment please.", 
        colour: "yellow",
        loginButton: false, 
        isVisible: true
      }))
    }  

    if (status === "reconnecting") {
      dispatch(notification({
        id: "reconnecting",
        message: "Trying to reconnect... One moment please.", 
        colour: "yellow",
        loginButton: false, 
        isVisible: true
      }))
    }  

    if (status != "reconnecting") {
      dispatch(updateNotificationVisibility({
        id: "reconnecting",
        isVisible: false
      }))
    }  
    
    if (status === "connected") {
      dispatch(updateNotificationVisibility({
        id: "notConnected",
        isVisible: false
      }))
      dispatch(updateModalVisible(false)) // £todo: check if use of redux is necessary here. If not: simple useState will do. 
      setUserLoggedIn(address)
    }

  }, [ , status])

  // console.log(
  //   "pre render console log", 
  //   "selectedLoyaltyProgram: ", selectedLoyaltyProgram, 
  //   "address", address, 
  //   "loyaltyCards: ", loyaltyCards, 
  //   "selectedLoyaltyCard: ", selectedLoyaltyCard  
  // )

  if (status != "connected") {
    return (
      <>
      {/* <NavbarTop/> */}
        <div className="grow justify-center w-full h-full max-w-4xl overflow-y-scroll">

        <div className="static w-full max-w-4xl h-dvh z-1">
          <div className="flex flex-col pt-14 h-full z-3">
            <NotificationDialog/> 
          </div> 
        </div>

        {/* <NavbarBottom selection = {"customer"}/> */}
        </div> 
      </>
    )
  }

  return (
    <>
    {/* <NavbarTop/> */}
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
                       <div className="text-center text-slate-500 mt-6">
                        Retrieving loyalty cards... 
                      </div> 
                    </div> 
                  }
              </div>
              </div>
          </div>
      </div>
    </div>
    {/* <NavbarBottom selection = {"customer"}/> */}
  </div>
  </>
)};
