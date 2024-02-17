
"use client"; 

import QRCode from "react-qr-code";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { useAppSelector } from "@/redux/hooks";
import { useAccount, usePublicClient } from "wagmi";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem";
import { Transaction } from "@/types";
import { parseTransferSingleLogs } from "@/app/utils/parsers";



export default function RequestCard()  {
  const publicClient = usePublicClient();
  const [ cardReceived, setCardReceived ] = useState<Transaction[]>() 
  const { address } = useAccount() 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const dispatch = useDispatch() 

  console.log("cardReceived: ", cardReceived)

  if (selectedLoyaltyProgram) {
    publicClient.watchContractEvent({
      abi: loyaltyProgramAbi,
      eventName: 'TransferSingle', 
      args: {from: selectedLoyaltyProgram.programOwner }, 
      pollingInterval: 5_000, 
      onLogs: (logs: Log[]) => setCardReceived(parseTransferSingleLogs(logs)) 
    })
  }

  useEffect(() => { 
    if (cardReceived) {
      dispatch(notification({
        id: "cardReceived",
        message: `Success! Card with Id: ${cardReceived[0].ids[0]} received.`, 
        colour: "green",
        isVisible: true
      }))
    }
    // setShowRequestCard(false)
  }, [cardReceived])

  return (
    <div className="grid grid-cols-1 h-4/5 content-between pt-2">

      <div className="text-center p-3">
        <TitleText 
          title = "Request Loyalty Card"
          subtitle="Let vendor scan this QR code to request a loyalty card" 
          size={2}
          /> 
      </div>
      <div className="grid justify-center justify-items-center p-6">
          <QRCode 
            value={`type:requestCard;lp:${selectedLoyaltyProgram?.programAddress};ca:${address}`}
            style={{ height: "100%", width: "100%", objectFit: "cover"  }}
            bgColor="#000000" // "#0f172a" 1e293b
            fgColor="#ffffff" // "#e2e8f0"
            level='L'
            className="rounded-lg border border-8 border-black dark:border-white"
            />
      </div>
      
      <div className="h-20"/> 
    </div>
    )
  }
