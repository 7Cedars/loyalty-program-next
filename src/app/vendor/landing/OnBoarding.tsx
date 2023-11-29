// TODO 

import { Log } from "viem";
import { Button } from "@/app/ui/Button";
import { useContractRead } from 'wagmi'
import { loyaltyProgramAbi } from "@/context/abi";

type InputProps = {
  componentData: Log[], 
  selection: number
}

export default function OnBoarding({componentData, selection}: InputProps)  {

  const handler = () => {
    // empty placeholder for now. 
  }

  const { data, isError, isLoading } = useContractRead({
    address: componentData[0].address ? componentData[0].address : '0x0000000000000000000000000000000000000000',
    abi: loyaltyProgramAbi,
    functionName: 'uri',
    args: [0],
  })

  console.log("data uri: ", data)


return (
  <div className="grid grid-cols-1">

    <div className="text-center p-3 pt-12">
      ONBOARDING
    </div>
    <div className="text-center p-3">
      Scan to activate customer loyalty card 
    </div>
    <div className="flex justify-center justify-items-center border-red-500 pt-6">

    </div>
    <div className="text-center p-3 pt-12">
      <Button isFilled={true} onClick={() =>  handler}>
        Choose another Loyalty Program
      </Button>
    </div>
  </div>
  )
} 