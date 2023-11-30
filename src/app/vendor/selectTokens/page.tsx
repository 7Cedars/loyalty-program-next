"use client"; 
import { ModalDialog } from "@/app/ui/ModalDialog";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";

export default function Page() {

  const {data, logs, isLoading} = useLoyaltyTokens() 

  console.log("data loyaltyTokens: ", data)

  return (
     <div className="h-screen w-full flex flex-row">
      <div className='mt-20 w-96 space-y-0 pt-4 ps-12 '> 
        One
      </div>
      
      <div className='mt-20  pt-4  pe-12'> 
        Two
      </div> 
    </div> 
  );
}
