"use client"; 

import { useAccount } from 'wagmi'
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { Button } from '@/app/ui/Button';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { updateNotificationVisibility } from '@/redux/reducers/notificationReducer';

export default function Page() {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { open, close } = useWeb3Modal()
  const { selectedNetworkId } = useWeb3ModalState() 
  const [connectionNote, setConnectionNote] = useState("You need to connect to a network to use this app.")
  const [buttonText, setButtonText] = useState("Connect")
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (address && selectedNetworkId != undefined) {
      setConnectionNote(`Connected to: ${address}`)
      setButtonText(`On ${parseInt(selectedNetworkId)}`)
    }
  }, [selectedNetworkId, address])

  dispatch(updateNotificationVisibility({
    id: "NotLoggedIn",
    isVisible: false
  }))
  
  return (
    <div className="absolute top-0 z-1 h-screen w-full flex items-center justify-center space-x-0"> 
      <div className="flex min-h-screen flex items-center justify-center">
          <div className='flex flex-col divide-y divide-gray-600 w-full justify-center'> 
            <div className='p-2 text-center text-gray-600 hover:text-gray-900'> 
              {connectionNote} 
            </div>
            <div className='p-2 text-center text-gray-600 hover:text-gray-900'>

            <Button size="sm" isFilled={true} onClick = {() => open({view: "Networks"})}> 
              {buttonText} 
            </Button>
              
            </div>
          </div>
      </div>
    </div>
  );
}
