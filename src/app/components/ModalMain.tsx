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
import { NotificationDialog } from "../ui/notificationDialog";
import { useAccount } from "wagmi";
import { useUrlProgramAddress } from "../hooks/useUrl";
import { useLoyaltyPrograms } from "../hooks/useLoyaltyPrograms";
import { useState, useEffect } from "react";
import { EthAddress, LoyaltyProgram } from "@/types";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import { parseEthAddress } from "../utils/parsers";

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

  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  let {data, logs, isLoading} = useLoyaltyPrograms() 
  const [selectedProgram, setSelectedProgram] = useState<EthAddress>()
  const [ownedPrograms, setOwnedPrograms] = useState<LoyaltyProgram[]>()

  console.log("ownedPrograms: ", ownedPrograms, "selectedProgram: ", selectedProgram)



  if (!address) {
    dispatch(notification({
      id: "NotLoggedIn",
      message: "You are not connected to a network.", 
      colour: "red",
      loginButton: true, 
      isVisible: true
    }))
  } 

  useEffect(() => {
    const indexProgram = logs.findIndex(item => item.address === progAddress); 

    if (indexProgram !== -1 && progAddress) {
      setSelectedProgram(parseEthAddress(progAddress))
      
      dispatch(updateNotificationVisibility({
        id: "LoggedIn",
        isVisible: false
      }))
    }
    if (data) {
      setOwnedPrograms(data)
    }

  }, [ , address, progAddress, data])



  return (
    
      <div className="absolute w-full max-w-4xl h-screen z-1">
        <div className="flex flex-col pt-14 h-full">
        
        <NotificationDialog/> 
        
        { modalVisible ? 
          <div className="flex flex-col mt-2 h-full bg-slate-50/[.90] mx-8 rounded-t-lg z-8">
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
            <div className="h-full justify-center"> 

            {children}

            </div>
          </div>
        
        :
        <button 
          className="w-full h-full"
          type="submit"
          onClick={() => dispatch(updateModalVisible(true))} // should be true / false
          >
        </button>
      }
      </div>
    </div>
    
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