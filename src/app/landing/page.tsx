"use client"; 

import { Suspense, useEffect, useState } from "react"
import UrlToLocalStorage from "../customer/components/UrlToLocalStorage"
import Image from "next/image"
import { Button } from "../ui/Button";
import Link from "next/link";
import { TitleText } from "../ui/StandardisedFonts";
import { useWalletClient } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

// NB: Notice the use of suspense to load url into redux. 
// This is done because this version of Wagmi (which is needed with this version of Web3Modal) cannot deal with 
// Next 'Entire page deopted into client-side rendering' error; 
// which in turn is caused by the use of useSearchParams. I causes web3modal to not show up. As I used useSearchParam in 
// each and every page - web3modal never showed up. 
// see description of this bug here: https://github.com/WalletConnect/web3modal/issues/1386 
// As a solution I create a single component that reads url once, and then transfers it to redux. 
// see this solution here (from next documentation): https://nextjs.org/docs/messages/deopted-into-client-rendering

export default function Page()  {
  const [progAddress, setProgAddress] = useState<string | null  >(); 
  const [progUri, setProgUri] = useState<string | null >(); 
  const [progChainId, setProgChainId] = useState<number | null >(); 
  const { data: walletClient, status } = useWalletClient();
  const { open, close } = useWeb3Modal()

  console.log("walletClient: ", walletClient)

  useEffect(() => {
    window.addEventListener('localStorageUpdated', () => {
      setProgAddress(localStorage.getItem("progAddress"))
      setProgUri(localStorage.getItem("progUri")) 
      setProgChainId(Number(localStorage.getItem("progChainId")))  
    })
  }, [])
  
  function UrlToLocalStorageFallback() {
    return  (
      <div className="grow flex items-center justify-center text-slate-800 dark:text-slate-200 z-40">
        ... 
      </div>
    )
  }

  return (
    <div 
      className="w-full h-full flex bg-slate-100 dark:bg-slate-900 aria-hidden:bg-opacity-0"
      aria-hidden = {true}
      >
      
      <div className="grid grid-cols-1 w-full h-full justify-items-center content-center z-10">
      { !progAddress ?
      <Suspense fallback={<UrlToLocalStorageFallback />}>
        <UrlToLocalStorage /> 
      </Suspense>
      :
      null   
      }

        <div className="w-68 h-full m-3 p-6 grid grid-cols-1 justify-items-center content-center text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 backdrop-blur-xl shadow-xl">

        <div 
          className="grid h-full grid-cols-1 gap-4 justify-items-center content-center aria-hidden:bg-opacity-0 transition-all delay-500 duration-1000"
          aria-hidden = {!progAddress}
          >      
          <Image
            className=""
            width={100}
            height={200}
            src={"/images/iconLoyaltyProgram.svg"} 
            alt="Icon Loyalty Program"
          />
           <TitleText title="Say hi to Loyal" subtitle="A one-stop, mobile first, solution for customer loyalty programs." size={2} />  
          </div>
          
          <Link 
            href="/customer/home" 
            className="h-fit flex mx-3 m-3 transition-all delay-500 duration-1000 z-50 "
            >
            <div 
              className=" flex opacity-100 aria-hidden:opacity-0 grid grid-cols-1 gap-1"
              aria-hidden = {!progAddress}
              >
                <Button appearance="grayEmpty">
                  Enter
                </Button>
            </div>
          </Link> 

      </div>
      </div>

      <Image
        className="absolute inset-0 z-0 opacity-100 aria-hidden:opacity-0 transition-all delay-300 duration-1000"
        fill 
        style = {{ objectFit: "cover" }} 
        src={progUri ? progUri : "/images/loading2.svg"} 
        // src={"/images/loading2.svg"} 
        alt="Loyalty Card"
        aria-hidden = {!progUri}
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
