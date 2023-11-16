"use client"; 

import { useAccount } from 'wagmi'
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { Button } from '@/app/ui/Button';
import { useEffect, useState } from 'react';

export default function Page() {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { open, close } = useWeb3Modal()
  const { selectedNetworkId } = useWeb3ModalState() 
  const [connectionNote, setConnectionNote] = useState("You need to connect to a network to use this app.")
  const [buttonText, setButtonText] = useState("Connect")

  useEffect(() => {
    if (address && selectedNetworkId != undefined) {
      setConnectionNote(`Connected to: ${address}`)
      setButtonText(`On ${parseInt(selectedNetworkId)}`)
    }
  }, [selectedNetworkId, address])
  
  return (
    <div className="absolute top-0 max-w-screen-lg h-screen w-full flex items-center justify-center space-x-0 border-2 border-red-800"> 
      <div className="flex min-h-screen flex items-center justify-center w-1/2">
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
