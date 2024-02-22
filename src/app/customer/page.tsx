"use client"; 

import { useAppSelector } from "@/redux/hooks"
import { Suspense, useEffect } from "react"
import { useDispatch } from "react-redux"
import UrlToRedux from "./components/UrlToRedux"
import Image from "next/image"
import { useLoyaltyPrograms } from "../hooks/useLoyaltyPrograms"
import { Button } from "../ui/Button";

// NB: Notice the use of suspense to load url into redux. 
// This is done because this version of Wagmi (which is needed with this version of Web3Modal) cannot deal with 
// Next 'Entire page deopted into client-side rendering' error; 
// which in turn is caused by the use of useSearchParams. I causes web3modal to not show up. As I used useSearchParam in 
// each and every page - web3modal never showed up. 
// see description of this bug here: https://github.com/WalletConnect/web3modal/issues/1386 
// As a solution I create a single component that reads url once, and then transfers it to redux. 
// see this solution here (from next documentation): https://nextjs.org/docs/messages/deopted-into-client-rendering

export default function Page()  {
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram)
  const {status, loyaltyPrograms, fetchPrograms} = useLoyaltyPrograms()
  const dispatch = useDispatch()

  function UrlToReduxFallback() {
    return  (
      <div className="grow flex items-center justify-center text-slate-800 dark:text-slate-200 z-40">
        fallback text. This is probably an error. 
      </div>
    )
  }

  console.log("loyaltyPrograms: ", loyaltyPrograms, "status: ", status)

  return (
    <div className="w-full h-full flex grow">
      <Suspense fallback={<UrlToReduxFallback />}>
        <UrlToRedux /> 
      </Suspense>

      <Image
        className="absolute inset-0 z-0 opacity-100 aria-hidden:opacity-0 transition-all delay-300 duration-1000"
        fill 
        style = {{ objectFit: "cover" }} 
        src={selectedLoyaltyProgram && selectedLoyaltyProgram.metadata ? selectedLoyaltyProgram.metadata.imageUri : "/images/loading2.svg"} 
        alt="Loyalty Card Token"
        aria-hidden = {selectedLoyaltyProgram == undefined}
      />

      </div> 
  )
      {/* <> */}
        
          
    //     <div className="flex flex-col justify-self-center pt-2 pb-6 w-full md:px-48 px-6"> 
    //       <div className="text-center">
    //         {` Loyalty Card Id: ${selectedLoyaltyCard?.cardId}`}
    //       </div>
    //       <div className="pb-2 text-center border-b border-slate-700">
    //         {` Loyalty Card Address: ${selectedLoyaltyCard?.cardAddress?.slice(0,6)}...${selectedLoyaltyCard?.cardAddress?.slice(36,42)}`}
    //       </div>
    //     </div>
            
    //     <div className="flex flex-col justify-between p-1 h-full">
    //       <div className="grid justify-center justify-items-center">
    //           <QRCode 
    //             value={`type:giftPoints;lp:${selectedLoyaltyProgram?.programAddress};lc:${selectedLoyaltyCard?.cardAddress}`}
    //             style={{ 
    //               height: "350px", 
    //               width: "350px", 
    //               objectFit: "cover", 
    //               background: 'white', 
    //               padding: '16px', 
    //             }}
    //             bgColor="#ffffff" // "#0f172a" 1e293b
    //             fgColor="#000000" // "#e2e8f0"
    //             level='L'
    //             className="rounded-lg"
    //             />
    //       </div>
    //     </div>

    //     <div className="flex md:px-48 px-6 h-14">
    //       <Button onClick={() => dispatch(resetLoyaltyCard(true))} appearance="grayEmpty">
    //         Switch cards or Request new one
    //       </Button>
    //     </div> 

    //     <div className="h-14"/> 
    //   {/* </> */}
    // {/* } */}

    // </div>  
    // </DynamicLayout>
    // )
}
