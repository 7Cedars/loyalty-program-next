import { useAccount } from 'wagmi'
import { LoyaltyProgram } from "@/types";
import { TitleText } from "../ui/TitleText";
import { useLoyaltyPrograms } from "../hooks/useLoyaltyPrograms";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUrlProgramAddress } from '../hooks/useUrl';

export default function ChooseProgram()  {
  const { address } = useAccount() 
  let { data } = useLoyaltyPrograms() 
  const [ownedPrograms, setOwnedPrograms] = useState<LoyaltyProgram[]>()
  const { putProgAddressInUrl } = useUrlProgramAddress() 

  useEffect(() => {
    if (data) { setOwnedPrograms(data) }
  }, [, data, address]) // is address necessary here? 

  // Choosing program. -- This is what I have to get working 100% 
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
          {/* Here layouting still has to be fixed  */}
            <Link href={`/vendor/deployProgram`} > 
              Deploy New LoyaltyProgram
            </Link>
          </div> 
        </div> 
        <div className="w-[14vw] h-96 ms-4 opacity-0 border-2 border-green-500" /> 

      </div>
    </div>
  
    ) 
} 