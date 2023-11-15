"use client"; 

import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function Page() {
  const { open, close } = useWeb3Modal()

  open()

  return (    
    <>
      <div className='mt-20 w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
        One
      </div>

      <button onClick={() => open()}>Open Connect Modal</button>
      <button onClick={() => open({ view: 'Networks' })}>Open Network Modal</button>
      
      <div className='mt-20 flex-grow space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        Two
      </div> 
    </> 
  );
}
