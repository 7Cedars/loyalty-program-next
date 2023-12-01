
"use client"; 

// Will do clean up later. 
import { useLoyaltyPrograms } from "@/app/hooks/useLoyaltyPrograms";
import { useAccount } from "wagmi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/app/ui/Button";
import { LoyaltyProgram } from "@/types";
import { BASE_URI } from "@/context/constants";

export default function Page()  {
  const { address }  = useAccount()
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  let {data, logs} = useLoyaltyPrograms() 
  const [selectedProgram, setSelectedProgram] = useState<LoyaltyProgram>()

  useEffect(() => {
    const indexProgram = logs.findIndex(item => item.address === progAddress); 
    setSelectedProgram(data[indexProgram])
  },[, address, logs])

  return (
    <div className="grid grid-cols-1">
  
      <div className="text-center p-3 pt-12">
        {selectedProgram?.metadata.name}
      </div>
      <div className="text-center p-3">
        Scan to activate customer loyalty card 
      </div>
      <div className="flex justify-center justify-items-center border-red-500 pt-6">
          <QRCode 
            value={`${BASE_URI}?customer/landing/?prog:${progAddress}`}
            style={{ height: "400", maxWidth: "75%", width: "80%" }}
            />
      </div>
      <div className="text-center p-3 pt-12">
        <Button isFilled={true} onClick = {() => putProgAddressInUrl(null) }> 
          Choose another Loyalty Program
        </Button>
      </div>
    </div>
    )
  }
