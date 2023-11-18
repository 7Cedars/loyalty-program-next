"use client"; 
import { useBalance } from 'wagmi'
import { ModalDialog } from '@/app/ui/ModalDialog';


// NB: See here for getting contract events https://viem.sh/docs/contract/getContractEvents.html

export default function Page() {

  // const { data, isError, isLoading } = useBalance({
  //   address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  // })

  let text = "TEST TEST"
  // if (isLoading) text = "loading balance." 
  // if (isError) text = "error fetching balance."
  // if (data) text = `Balance: ${data.symbol} ${data.value}` 

  return (
    <ModalDialog>
    <div className="h-screen w-full flex flex-row space-x-0">
      <div className='mt-20 w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
        {text}
      </div>
      
      <div className='mt-20 flex-grow space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        Two
      </div> 
    </div> 
    </ModalDialog>
  );
}
