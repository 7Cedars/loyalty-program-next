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
import { useState, useEffect } from "react";
import { EthAddress, LoyaltyProgram } from "@/types";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import { resetLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { parseEthAddress } from "../../utils/parsers";
import ChooseProgram from "./ChooseProgram";
import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import Image from "next/image";

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
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [ userLoggedIn, setUserLoggedIn ] = useState<EthAddress | undefined>() 
  const { putProgAddressInUrl } = useUrlProgramAddress()

  console.log("address at ModalMain: ", address)
  console.log("selectedLoyaltyProgram at ModalMain: ", selectedLoyaltyProgram)
  console.log("userLoggedIn at ModalMain: ", selectedLoyaltyProgram)

  useEffect(() => {
    if (address != userLoggedIn) {
      setUserLoggedIn(undefined)
      dispatch(resetLoyaltyProgram(true))
      putProgAddressInUrl(null)
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

  console.log("selectedLoyaltyProgram: ", selectedLoyaltyProgram)

  if (!selectedLoyaltyProgram) {
    return (
      <div className="relative w-full max-w-4xl h-screen z-1">
        <div className="flex flex-col pt-14 h-full z-3">
          <NotificationDialog/> 
          { address ?  <ChooseProgram /> : null }  
        </div> 
      </div>
    )
  }

  return (
    <>
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
            <div className="flex flex-col mt-2 h-full scroll-auto bg-slate-50/[.90] backdrop-blur-xl shadow-[0_12px_25px_-6px_rgba(0,0,0,0.5)] mx-4 rounded-t-lg z-10"> 
            {/* /[.95] */}
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
    </>

    
  )};


// Example from snapshot dashboard project. // 
//   <Transition appear show={(modal === modalName)} as={Fragment}>
//   <Dialog as="div" className="relative z-" 
//     onClose={() => dispatch(updateModal('none'))}
//     >
//     <Transition.Child
//       as={Fragment}
//       enter="ease-out duration-300"
//       enterFrom="opacity-0"
//       enterTo="opacity-100"
//       leave="ease-in duration-200"
//       leaveFrom="opacity-100"
//       leaveTo="opacity-0"
//       >
//       <div className="fixed inset-0 bg-black bg-opacity-25 max-h-screen" />
//     </Transition.Child>

//     <div className="fixed inset-0 overflow-y-auto">
//     <div className="flex min-h-full items-center justify-center p-4 text-center">
//         <Dialog.Panel className="min-w-fit max-h-[52rem] transform rounded-2xl  overflow-auto  bg-white p-6 text-left align-middle shadow-xl transition-all">
        
//         <div className='flex justify-end '> 
//           <button 
//             className="text-black font-bold pt-2 px-2"
//             type="submit"
//             onClick={() => dispatch(updateModal('none'))}
//             >
//             <XMarkIcon
//               className="h-7 w-7"
//               aria-hidden="true"
//             />
//           </button>
//         </div>
//           <Dialog.Title
//             as="h2"
//             className="text-lg font-medium leading-6 text-gray-900"
//           >
//             <p> {title} </p>
//           </Dialog.Title>

//           <div className="grid grid-cols-1 mt-1 w-full">
//             <p className="text-gray-500 mb-2">
//               {subtitle}
//             </p>
    
//              {children}

//           </div>
//         </Dialog.Panel>
//       </div> 
//     </div> 

//   </Dialog>
// </Transition>