"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { NotificationDialog } from "../../ui/notificationDialog";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { EthAddress } from "@/types";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import { resetLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import ChooseProgram from "./ChooseProgram";
import Image from "next/image";

type ModalProps = {
  children: any;
};

export const DynamicLayout = ({
  children 
}: ModalProps) => {

  // Note this ui modal dialog expects the use of redux. 
  // I can change this in other apps if needed.
  const dispatch = useAppDispatch()
  // const { modalVisible } = useAppSelector(state => state.userInput) 
  const [ modalVisible, setModalVisible ] = useState<boolean>(true); 
  const { address, status }  = useAccount()
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  // const [ userLoggedIn, setUserLoggedIn ] = useState<EthAddress | undefined>() 
  console.log("status wagmi:" , status)
  

  useEffect(() => {
    // walletConnect should take care of this... 
    // if (address != userLoggedIn) {
    //   setUserLoggedIn(undefined)
    //   dispatch(resetLoyaltyProgram(true))
    // }

    if (status === "disconnected") {
      dispatch(notification({
        id: "notConnected",
        message: "You are not connected to a network.", 
        colour: "red",
        loginButton: true, 
        isVisible: true
      }))
      setModalVisible(false)
      // setUserLoggedIn(undefined)
    }    

    if (status === "connecting") {
      dispatch(notification({
        id: "notConnected",
        message: "Connecting....", 
        colour: "yellow",
        loginButton: true, 
        isVisible: true
      }))
    }  
    
    if (status === "connected") {
      dispatch(updateNotificationVisibility({
        id: "notConnected",
        isVisible: false
      }))
      setModalVisible(true)
      // setUserLoggedIn(address)
    }

  }, [ , status])

  if (status != "connected") {
    return  null 
  }

  if (!selectedLoyaltyProgram && status === "connected") {
    return (
      <div className="static w-full max-w-4xl h-dvh z-1">
        <div className="flex flex-col pt-14 h-full z-3">
          <NotificationDialog/> 
            <ChooseProgram /> 
        </div> 
      </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-4xl h-dvh z-1">

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
            className="h-full aria-disabled:h-24 flex flex-col justify-center mx-2 backdrop-blur-xl shadow-[0_12px_25px_-6px_rgba(0,0,0,0.5)]  transition:all ease-in-out duration-300 overflow-x-auto bg-slate-200/[.90] dark:bg-slate-800/[.90] rounded-t-lg" 
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
                  { children }  
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )};