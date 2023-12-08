
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
import { TitleText } from "@/app/ui/StandardisedFonts";

export default function Page()  {
  const { address }  = useAccount()
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  let {data, ethAddresses} = useLoyaltyPrograms() 
  const [selectedProgram, setSelectedProgram] = useState<LoyaltyProgram>()

  useEffect(() => {
    const indexProgram = ethAddresses.findIndex(item => item === progAddress); 
    setSelectedProgram(data[indexProgram])
  },[, address, ethAddresses])

  return (
    <div className="grid grid-cols-1">

      <div className="text-center p-3">
        <TitleText 
          title = {selectedProgram ? selectedProgram?.metadata.name : "Loyalty Card"} 
          subtitle="Scan to activate customer loyalty card" 
          size={2}
          /> 
      </div>
      <div className="grid justify-center justify-items-center pt-6">
          <QRCode 
            value={`${BASE_URI}?customer/landing/?prog:${progAddress}`}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
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
