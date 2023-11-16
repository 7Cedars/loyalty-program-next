"use client"; 

import { ModalDialog } from "@/app/ui/ModalDialog";


export default function Page() {

  return (
    <ModalDialog> 
      <div className="h-full w-full flex flex-row space-x-0">
        <div className='mt-20 w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
          one
        </div>
        
        <div className='mt-20 flex-grow space-y-0 pt-4 grid grid-cols-1 pe-12'> 
          Two
        </div> 
      </div> 
    </ModalDialog>
  );
}
