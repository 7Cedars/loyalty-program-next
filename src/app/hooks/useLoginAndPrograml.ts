import { useAccount } from "wagmi"
import { useDispatch } from "react-redux"
import { useLoyaltyProgramAddress } from "./useUrl"
import { useContractLogs } from "./useContractLogs"
import { loyaltyProgramAbi } from "@/context/abi"
import { notification } from "@/redux/reducers/notificationReducer"
import { useRef } from "react"


export const useLoginAndProgram = () => {

  let { address } = useAccount()
  const dispatch = useDispatch() 
  const { progAddress } = useLoyaltyProgramAddress()

  const loggedIn = useRef<boolean>()
  const validProgram = useRef<boolean>()
  loggedIn.current = true
  validProgram.current = true
  
  // checking address
  if (address == undefined ) {
    dispatch(notification({
      id: "NotLoggedIn",
      message: "You are not logged in.", 
      linkText: "Go to login page.",
      linkHref: "/vendor/login", 
      colour: "red", 
      isVisible: true
    }))

    address = "0x0000000000000000000000000000"
    loggedIn.current = false
  }

  const {data} = useContractLogs(
    { 
      abi: loyaltyProgramAbi, 
      eventName: 'DeployedLoyaltyProgram', 
      args: {owner: address}, 
      fromBlock: 1n,
      toBlock: 16330050n
    }
  )

  const whichProgramSelected: boolean[] = data.map(item => item.address === progAddress); // naming of const's is still a bit ... iffy. 
  const indexProgram: number = whichProgramSelected.indexOf(true); 

  if (indexProgram != -1) { validProgram.current = false } 

  return {
    loggedIn: loggedIn.current,
    validProgram: validProgram.current, 
    data: data, 
    indexProgram: indexProgram
  }

}

