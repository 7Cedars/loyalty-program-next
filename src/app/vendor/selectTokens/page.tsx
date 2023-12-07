"use client"; 
import { ModalMain } from "@/app/components/ModalMain";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./TokenSmall";
import TokenBig from "./TokenBig";
import { DeployedContractLog, EthAddress, LoyaltyToken } from "@/types";
import { useEffect, useState, useRef } from "react";
import { useContractRead } from "wagmi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { getContractEventsProps } from "@/types"
import { parseContractLogs, parseEthAddress, parseLoyaltyContractLogs } from "@/app/utils/parsers";

type setSelectedTokenProps = {
  token: LoyaltyToken; 
  disabled: boolean; 
}


export default function Page() {

  const [loyaltyTokens, setLoyaltyTokens] = useState<LoyaltyToken[] | undefined>() 
  const activeLoyaltyTokens = useRef<LoyaltyToken[] | undefined>() 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const { progAddress } = useUrlProgramAddress() 
  const {data, isLoading, isError} = useLoyaltyTokens() 
  const publicClient = usePublicClient()

  useEffect(() => {

    const getSelectedtokens = async () => {
      const data: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(progAddress), 
        eventName: 'AddedLoyaltyTokenContract', 
        fromBlock: 1n,
        toBlock: 16330050n
      }); 

      console.log("logs from AddedLoyaltyTokenContract: ", data)

      const parsedData: EthAddress[] = parseLoyaltyContractLogs(data)

      console.log("loyaltyTokens: ", loyaltyTokens, "parsedData: ", parsedData)

      if (loyaltyTokens) {
        console.log(loyaltyTokens.map(token => parseEthAddress(token.tokenAddress) === parseEthAddress(parsedData[0])))
        activeLoyaltyTokens.current = loyaltyTokens.filter(token => String(token.tokenAddress) === String(parsedData[0]))
      }

      console.log("activeLoyaltyTokens.current: ", activeLoyaltyTokens.current)
    } 

    getSelectedtokens() 

  }, [[ , progAddress, publicClient]])


  console.log(
    "loyaltyTokens: ", loyaltyTokens, 
    "activeLoyaltyTokens: ", activeLoyaltyTokens.current, 
    "dataLoyaltyTokens.isLoading: ", isLoading
    )

  useEffect(() => {

    if (data.length > 0 && !isLoading) {
      setLoyaltyTokens(data)
    }

  }, [ 
    , 
    data, 
    isLoading
  ])

  // console.log("data loyaltyTokens: ", data, " isLoading at LoyaltyToken: ", isLoading )

  return (
     <div className=" w-full grid grid-cols-1 gap-1">

      <div className="h-20 m-3"> 
       <TitleText title = "Select Loyalty Gifts" subtitle="View and select gifts that customers can claim with their loyalty points." size={1} />
      </div> 

      { selectedToken ? 
      <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-3">
        <button 
          className="text-black font-bold p-3"
          type="submit"
          onClick={() => setSelectedToken(undefined)} // should be true / false
          >
          <ArrowLeftIcon
            className="h-7 w-7"
            aria-hidden="true"
          />
        </button>

        <TokenBig token={selectedToken.token} disabled = {selectedToken.disabled} /> 
      
      </div>
      :
      
      <>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          <div className="col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "Selected Gifts" size={0} />
          </div>

          { activeLoyaltyTokens.current ?
          
          activeLoyaltyTokens.current.map((token: LoyaltyToken) => 
              <div key = {token.tokenAddress} >
                <TokenSmall token = {token} disabled = {false} onClick={() => setSelectedToken({token: token, disabled: false})}  /> 
              </div>
            
            )
          : 
          <div className="col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
            <NoteText message=" Selected tokens will appear here."/>
          </div>
          }
        </div> 
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          <div className="col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "Available Gift Programs" size={0} />
          </div>
          
          { loyaltyTokens ? 
            loyaltyTokens.map((token: LoyaltyToken) => 
              <div key = {token.tokenAddress} >
                <TokenSmall token = {token} disabled = {true}  onClick={() => setSelectedToken({token: token, disabled: true})} /> 
              </div>
            )
            : 
            <div className="col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
              <NoteText message="Other available tokens will appear here."/>
            </div>
          }
        </div>
      </>

    }
    
    </div> 
    
  );
}
