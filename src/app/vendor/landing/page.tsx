
"use client"; 

import { useLoyaltyPrograms } from "@/app/hooks/useLoyaltyPrograms";
import { TitleText } from "@/app/ui/TitleText";
import { EthAddress, LoyaltyProgram } from "@/types";
import { Button } from "@/app/ui/Button";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import ShowQrcode from "./ShowQrcode";
import { parseEthAddress } from "@/app/utils/parsers";


export default function Page()  {
  const { address }  = useAccount()
  const router = useRouter();
  const dispatch = useDispatch() 
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  let {data, logs, isLoading} = useLoyaltyPrograms() 
  const [selectedProgram, setSelectedProgram] = useState<EthAddress>()
  const [ownedPrograms, setOwnedPrograms] = useState<LoyaltyProgram[]>()

  console.log("ownedPrograms: ", ownedPrograms, "selectedProgram: ", selectedProgram)

  if (!address) {
    dispatch(notification({
      id: "NotLoggedIn",
      message: "You are not connected to a network.", 
      colour: "red",
      loginButton: true, 
      isVisible: true
    }))
  } 

  useEffect(() => {
    const indexProgram = logs.findIndex(item => item.address === progAddress); 

    if (indexProgram !== -1 && progAddress) {
      setSelectedProgram(parseEthAddress(progAddress))
      
      dispatch(updateNotificationVisibility({
        id: "LoggedIn",
        isVisible: false
      }))
    }
    if (data) {
      setOwnedPrograms(data)
    }

  }, [ , address, progAddress, data])

  const handleClick = (address: EthAddress) => {

    setSelectedProgram(address)
    putProgAddressInUrl(address)

  }

  if (selectedProgram) {
    const indexProgram = logs.findIndex(item => item.address === selectedProgram)
    console.log("selectedProgram: ", selectedProgram)
    console.log("indexProgram: ", indexProgram)
    return <ShowQrcode data = {data[indexProgram]} /> // NB! 
  } else { 

    return (

      <div> 
        <TitleText title = "Choose Loyalty Program" subtitle="Choose existing program or deploy a new one." size={1} /> 
        <div className="grid grid-rows-1 grid-flow-col h-full overflow-x-scroll overscroll-auto mb-12"> 
          {/* (The following div is an empty div for ui purposes)   */ }
          <div className="w-[16vw] h-96 ms-4 opacity-0 border-2 border-green-500" /> 
          { ownedPrograms ? 
            ownedPrograms.map(program => {

              return (
                <button 
                  key={program.tokenAddress}
                  onClick = {() => handleClick(program.tokenAddress)}
                  
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
