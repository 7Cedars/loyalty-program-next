"use client"; 

import { useLoyaltyPrograms } from "@/app/hooks/useLoyaltyPrograms";

export default function Page()  {

  const tempData: string[] = ["0x8464135c8f25da09e49bc8782676a84730c318bc", "0xbc9129dc0487fc2e169941c75aabc539f208fb01", "0x663f3ad617193148711d28f5334ee4ed07016602"]
  const {loyaltyPrograms, metadata} = useLoyaltyPrograms() 

  console.log("loyaltyPrograms: ", loyaltyPrograms)
  console.log("loyaltyPrograms metadata: ", metadata)

  return (
    <div className="grid grid-rows-1 grid-flow-col overflow-x-scroll overscroll-auto m-12"> 
    {
      tempData.map(item => {

        return (
          <div 
            key={item}
            className="ms-20 mt-20 w-96 h-128 border-2 border-red-500"
            > {item} 
          </div>
        )
      })
    }
      <div className="ms-20 mt-20 w-96 h-128 border-2 border-green-500"> 

        And here comes an onboarding link 

      </div> 
    </div>

  ) 

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

}
