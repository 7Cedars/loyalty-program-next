"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateModal } from "@/redux/reducers/userInputReducer";
import { XMarkIcon } from "@heroicons/react/24/outline";

type ModalProps = {
  // modalName: string; 
  // title: string; 
  // subtitle: string; 
  children: any;
};

export const ModalDialog = ({
  // modalName, 
  // title, 
  // subtitle, 
  children 
}: ModalProps) => {

  // Note this ui modal dialog expects the use of redux. 
  // I can change this in other apps if needed. 
  const dispatch = useAppDispatch()
  const { modal } = useAppSelector(state => state.userInput) // should be modalVisible


  return (
    <div className="w-full h-full ">
      <div className="grid grid-cols-1 h-full bg-slate-50 mx-8 mt-16 rounded-t-lg">
        <div className="flex h-12 justify-end p-2"> 
        <button 
            className="text-black font-bold pt-1 px-2"
            type="submit"
            onClick={() => dispatch(updateModal('none'))} // should be true / false
            >
            <XMarkIcon
              className="h-7 w-7"
              aria-hidden="true"
            />
        </button>
      </div>
      <div > 

        {children}

      </div>
      </div>
    </div>
  )};



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