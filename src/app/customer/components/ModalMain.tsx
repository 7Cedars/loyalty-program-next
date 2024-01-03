"use client";

  // Here I can implement enforcement of login and valid accound and customer loyalty cards
  // - at each page check for login and valid card. 
  // - if not: send update to dedicated redux reducer
  // - in this page I can then 
  // - (when no proper login: )
  //   - update notification reducer 
  //   - NOT show children 
  // - (when no valid card)
  //   - update notification reducer 
  //   - show component for choosing card. 
  // This way: all this complexity is kept away from each page... 

  // later implement transitioning. WIP 


import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateModalVisible } from "@/redux/reducers/userInputReducer";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { NotificationDialog } from "../../ui/notificationDialog";
import { useAccount } from "wagmi";
import { useUrlProgramAddress } from "../../hooks/useUrl";
import { useLoyaltyProgram } from "../../../depricated/useLoyaltyProgram";
import { useState, useEffect } from "react";
import { EthAddress, LoyaltyProgram } from "@/types";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import { resetLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { parseEthAddress, parseUri, parseMetadata } from "../../utils/parsers";
import ChooseLoyaltyCard from "../home/SelectLoyaltyCard";
import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import Image from "next/image";
import { usePublicClient } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { selectLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { resetLoyaltyCard } from "@/redux/reducers/loyaltyCardReducer";

type ModalProps = {
  children: any;
};

export const ModalMain = ({
  children 
}: ModalProps) => {

  // Note this ui modal dialog expects the use of redux. 
  // I can change this in other apps if needed.
  const dispatch = useAppDispatch()
  const { modalVisible } = useAppSelector(state => state.userInput) 
  const { address }  = useAccount()
  const publicClient = usePublicClient(); 
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [ userLoggedIn, setUserLoggedIn ] = useState<EthAddress | undefined>() 
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  const [ loyaltyProgram, setLoyaltyProgram ] = useState<LoyaltyProgram>() 

  // console.log("address at ModalMain customer: ", address)
  // console.log("selectedLoyaltyProgram at ModalMain customer: ", selectedLoyaltyProgram)
  // console.log("userLoggedIn at ModalMain customer: ", selectedLoyaltyProgram)

  const getLoyaltyProgramUri = async () => {
    // console.log("getLoyaltyProgramsUris called. ProgAddress:", progAddress)

    if (progAddress) {

      try { 
        const uri: unknown = await publicClient.readContract({
          address: parseEthAddress(progAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'uri',
          args: [0]
        })

        console.log("URI: ", uri)

        setLoyaltyProgram({programAddress: parseEthAddress(progAddress), uri: parseUri(uri)})
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

    if (!loyaltyProgram || !loyaltyProgram.uri ) { getLoyaltyProgramUri() } // check when address has no deployed programs what happens..  
    if (
      loyaltyProgram && 
      !loyaltyProgram.metadata  
      ) { getLoyaltyProgramMetaData() } 
    if (
      loyaltyProgram && 
      loyaltyProgram.metadata 
      ) { dispatch(selectLoyaltyProgram(loyaltyProgram))}
  }, [, progAddress, loyaltyProgram])

  // console.log("loyaltyProgram : ", loyaltyProgram)

  useEffect(() => {
    if (address != userLoggedIn) {
      setUserLoggedIn(undefined)
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

  return (
    <div className="relative w-full max-w-4xl h-screen z-1">

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
        
        { modalVisible && userLoggedIn != undefined ? 
          <div className="flex flex-col mt-2 h-full scroll-auto bg-slate-50/[.95] backdrop-blur-xl shadow-2xl mx-4 rounded-t-lg z-10"> 
            <div className="grow-0 flex justify-end"> 
              <button 
                  className="text-black font-bold pt-2 px-2"
                  type="submit"
                  onClick={() => dispatch(updateModalVisible(false))} // should be true / false
                  >
                  <XMarkIcon
                    className="h-7 w-7"
                    aria-hidden="true"
                  />
              </button>
            </div>

           { children }
          
          </div>
        :
        <button 
          className="w-full h-full z-10"
          type="submit"
          onClick={() => dispatch(updateModalVisible(true))} // should be true / false
          >
        </button>
      }
      </div>
  </div>
)};

