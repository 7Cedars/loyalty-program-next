// NB DEPRICATED 

import QRCode from "react-qr-code";
import { Log } from "viem";
import { Button } from "@/app/ui/Button";
import { useContractRead } from 'wagmi'
import { loyaltyProgramAbi } from "@/context/abi";
import { LoyaltyProgram } from "@/types";
import { useRouter } from "next/router";
import { BASE_URI } from "@/context/constants";

type ShowQrcodeProps = {
  data: LoyaltyProgram
}

const handleClick = () => {

}

export default function ShowQrcode({data}: ShowQrcodeProps)  {
  // const router = useRouter() 

  // loyaltyProgram.
return (
  <div className="grid grid-cols-1">

    <div className="text-center p-3 pt-12">
      NAME OF PROGRAM 
    </div>
    <div className="text-center p-3">
      Scan to activate customer loyalty card 
    </div>
    <div className="flex justify-center justify-items-center border-red-500 pt-6">
        <QRCode 
          value={`${BASE_URI}?customer/landing/?${data.tokenAddress}`}
          style={{ height: "400", maxWidth: "75%", width: "80%" }}
          />
    </div>
    <div className="text-center p-3 pt-12">
      <Button isFilled={true} onClick = { handleClick }> 
      {/* router.push(`/vendor/landing`) */}
        Choose another Loyalty Program
      </Button>
    </div>
  </div>
  )
} 