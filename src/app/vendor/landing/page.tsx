"use client"; 

import { useLoyaltyPrograms } from "@/app/hooks/useLoyaltyPrograms";
import { TitleText } from "@/app/ui/TitleText";
import { LoyaltyProgramMetadata } from "@/types";

export default function Page()  {

  const tempData: string[] = ["0x8464135c8f25da09e49bc8782676a84730c318bc", "0xbc9129dc0487fc2e169941c75aabc539f208fb01", "0x663f3ad617193148711d28f5334ee4ed07016602"]
  let {loggedIn, loyaltyPrograms, indexProgram} = useLoyaltyPrograms() 

  console.log("loyaltyPrograms at landing page: ", loyaltyPrograms)

  return (

    <div> 
      <TitleText title = "Choose Loyalty Program" subtitle="Choose existing program or deploy a new one." size={1} /> 
      <div className="grid grid-rows-1 grid-flow-col overflow-x-scroll overscroll-auto m-12"> 
      { loyaltyPrograms ? 
        loyaltyPrograms.map((program: LoyaltyProgramMetadata) => {

          return (
            <div 
              key={program.tokenAddress}
              className="ms-20 mt-12 w-80 h-96 border-2 border-red-500"
              > {program.uri} 
            </div>
          )
        })
        : 
        null
      }
        <div className="ms-20 mt-12 w-80 h-96 border-2 border-green-500"> 

          And here comes an onboarding link 

        </div> 
      </div>
    </div>
   
    ) 
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