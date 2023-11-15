"use client"; 

import { useAccount } from 'wagmi'
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { Button } from '@/app/ui/Button';
import { useEffect, useState } from 'react';

export default function Page() {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { open, close } = useWeb3Modal()
  const { selectedNetworkId } = useWeb3ModalState()

  console.log("selectedNetworkId: ", `${selectedNetworkId}` )

  const chainNames

  const [connectionNote, setConnectionNote] = useState("Error: No account state detected.")
  const [buttonText, setButtonText] = useState("Error: No account state detected.")

  useEffect(() => {
    if (address && selectedNetworkId != undefined) {
      setConnectionNote(`Connected to: ${address}`)
      setButtonText(`On ${parseInt(selectedNetworkId)}`)
    }
  }, [selectedNetworkId, address])
  
  return (    
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24 ">
        <div className='flex flex-col divide-y items-center divide-gray-600 w-full justify-center border-2 border-green-500'> 
          <div className='p-2 text-center text-gray-600 hover:text-gray-900'> 
            {connectionNote} 
          </div>
          <div className='p-2 text-center text-gray-600 hover:text-gray-900'>

          <Button size="sm" isFilled={true} onClick = {() => open({view: "Networks"})}> 
            {buttonText} 
          </Button>
            
          </div>
        </div>
    </main>
  );
}
