
"use client"; 

import { useLoyaltyPrograms } from "@/app/hooks/useLoyaltyPrograms";
import { TitleText } from "@/app/ui/TitleText";
import { LoyaltyProgramMetadata } from "@/types";
import { Button } from "@/app/ui/Button";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import ShowQrcode from "./ShowQrcode";


export default function Page()  {
  const { address }  = useAccount()
  const router = useRouter();
  const dispatch = useDispatch() 
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  let {data, logs, isLoading, indexProgram} = useLoyaltyPrograms() 
  const [tokenAddresses, setTokenAddresses] = useState<string[]>()

  console.log("tokenAddresses: ", tokenAddresses, "loyaltyPrograms.data: ", data, "loyaltyPrograms.logs: ", logs)

  useEffect(() => {
    const addresses = data?.map(item => item.tokenAddress)
    setTokenAddresses(addresses)

  }, [address, progAddress])

    // The following check might be good to put in custom hook. -- later. 
    if (!address) {
      //   // dispatch(notification({
      //   //   id: "NotLoggedIn",
      //   //   message: "You are not logged in. Redirected to login page", 
      //   //   colour: "red", 
      //   //   isVisible: true
      //   // }))
        router.push(`/vendor/login`)
      }

      console

  if (indexProgram != -1 && data) {
    return <ShowQrcode loyaltyProgram = {data[indexProgram]} /> // NB! 
  } else { 

  return (

    <div> 
      <TitleText title = "Choose Loyalty Program" subtitle="Choose existing program or deploy a new one." size={1} /> 
      <div className="grid grid-rows-1 grid-flow-col h-full overflow-x-scroll overscroll-auto mb-12"> 
        {/* (The following div is an empty div for ui purposes)   */ }
        <div className="w-[16vw] h-96 ms-4 opacity-0 border-2 border-green-500" /> 
        { data ? 
          data.map((program: LoyaltyProgramMetadata) => {

            return (
              <button 
                key={program.tokenAddress}
                onClick = {() => putProgAddressInUrl(program.tokenAddress)}
                
                  className="me-20 mt-12 w-72 h-128"> 
                     
                      <Image
                        className="rounded-lg"
                        width={288}
                        height={420}
                        src={program.metadata.imageUri}
                        alt="DAO space icon"
                      />
                    
              </button>
            )
          })
          : 
          null
        }
        <div className="me-20 mt-12 w-72 h-128 p-3 grid grid-cols-1 content-center border-2 rounded-lg border-gray-300"> 
          <div className="h-12 flex justify-center"> 
            <Button size="sm" isFilled={true} onClick = {() => router.push(`/vendor/deployProgram`)}> 
              Deploy New LoyaltyProgram
            </Button>
          </div> 
        </div> 
        <div className="w-[14vw] h-96 ms-4 opacity-0 border-2 border-green-500" /> 

      </div>
    </div>
   
    ) 
      }
  }

  // if (indexProgram != -1) {
  //   return <ShowQrcode componentData = {data} selection = {indexProgram} /> // NB! 
  // } else {
  //     if (data.length == 0) {
  //       return (
  //         <div> Zero deployed contracts. Invite to deploy program here </div>
  //       )
  //     }
  //     if (data.length == 1) {
  //       dispatch(notification({
  //         id: "NotOwnerProgram",
  //         message: `You do not own selected loyalty program, redirecting...`, 
  //         colour: "yellow", 
  //         isVisible: true
  //       })); 

  //       handleProgAddress(data[0].address)

  //     }
  //     if (data.length > 1) {
  //       dispatch(notification({
  //         id: "NotOwnerProgram",
  //         message: `You do not own selected loyalty program, redirecting...`, 
  //         colour: "yellow", 
  //         isVisible: true
  //       })); 
  //         return ( 
  //           <div> Multiple deployed contracts. choose </div>
  //         )
  //     }
  // }