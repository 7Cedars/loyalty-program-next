"use client"; 

import { useAccount } from 'wagmi'
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { Button } from '@/app/ui/Button';

export default function Page() {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { open, close } = useWeb3Modal()
  const { selectedNetworkId } = useWeb3ModalState()

  console.log("selectedNetworkId: ", selectedNetworkId)

  let connectionNote = "Error: No account state detected."
  let buttonText = "error: no account state detected."

  isConnecting ? connectionNote = "Connecting..." : null
  isDisconnected ? connectionNote = "Please connect to a network." : null
  if (isDisconnected) {buttonText= "connect"}
  if (address) {buttonText= "disconnect"}
  
  return (    
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24 ">
        <div className='flex flex-col divide-y items-center divide-gray-600 w-full justify-center border-2 border-green-500'> 
          <div className='p-2 text-center text-gray-600 hover:text-gray-900'> 
            {connectionNote} 
          </div>
          <div className='p-2 text-center text-gray-600 hover:text-gray-900'>

          <Button size="sm" isFilled={true} onClick = {() => open({view: "Connect"})}> 
            {buttonText} 
          </Button>
            
          </div>
        </div>
    </main>
  );
}
