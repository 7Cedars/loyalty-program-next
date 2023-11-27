"use client"; 
import {loyaltyProgramAbi} from "../../../context/abi" 
import { useAccount } from 'wagmi'
import { useContractLogs } from '@/app/hooks/useContractLogs';
import { getContractEventsProps } from "@/types"
import { Log } from "viem";
import ShowQrcode from './ShowQrcode';
import { useDispatch } from "react-redux";
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import { useLoyaltyProgramAddress } from "@/app/hooks/useUrl";
import { updateModalVisible } from "@/redux/reducers/userInputReducer";

export default function Page()  {
  const { address, isReconnecting } = useAccount()
  const dispatch = useDispatch() 
  const { progAddress, handleProgAddress } = useLoyaltyProgramAddress()

  // note that if not logged in, it loads ALL deployed loyalty programs. 
  // need to optmise at later stage. 
  const {data, isError, isLoading} = useContractLogs(
    { 
      abi: loyaltyProgramAbi, 
      eventName: 'DeployedLoyaltyProgram', 
      args: {owner: address}, 
      fromBlock: 1n,
      toBlock: 16330050n
    }
  )

  console.log("progAddress: ", progAddress) 
  if (address == undefined ) {
    dispatch(notification({
      id: "NotLoggedIn",
      message: `Please log in at LINK HERE`, 
      colour: "red", 
      isVisible: true
    }))
    dispatch(updateModalVisible(false))

    return null
  }

  const whichProgramSelected: boolean[] = data.map(item => item.address === progAddress); // naming of const's is still a bit ... iffy. 
  const indexProgram: number = whichProgramSelected.indexOf(true); 

  // NB! Need to implement actual redirecting to new page where necessary!
  // first fix notifications...   
  if (indexProgram != -1) {
    return <ShowQrcode componentData = {data} selection = {indexProgram} /> // NB! 
  } else {
      if (data.length == 0) {
        return (
          <div> Zero deployed contracts. Invite to deploy program here </div>
        )
      }
      if (data.length == 1) {
        dispatch(notification({
          id: "NotOwnerProgram",
          message: `You do not own selected loyalty program, redirecting...`, 
          colour: "red", 
          isVisible: true
        })); 

        return (
          <ShowQrcode componentData = {data} selection = {0} /> 
        )
      }
      if (data.length > 1) {
        dispatch(notification({
          id: "NotOwnerProgram",
          message: `You do not own selected loyalty program, redirecting...`, 
          colour: "red", 
          isVisible: true
        })); 
          return ( 
            <div> Multiple deployed contracts. choose </div>
          )
      }
  }


  // check if url address is owned by logged in address. 
  // if so: show QR code side. 
  // if not: automatic redirection to site without address uri. 

  // if no address is present in url: 
  // do as I had: 
  // no address available: onboard. 
  // 1 address: is redirect to that page. 
  // 2 or more addresses: choose. 

}
