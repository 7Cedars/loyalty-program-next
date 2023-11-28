// NB: this should incorporate the useLoginAndProgram hook. 

// Custom hook. 
// input: none. 

// Output: 
// array of objects: LoyaltyPrograms owned by logged in user. Each object consists of: 
// - LoyaltyProgram address
// - LoyaltyProgram name
// - Description 
// - Image
// - Attributes 
//   - vendor name
//   - vendor address
//   - vendor phone
// - the index of selected program (from Url) among owned loyaltyProgram. -1 indicates that selected program is NOT owned by user. 

// Refresh at: 
// change in address. 
// change in chain id. 

import { useAccount } from "wagmi"
import { useLoyaltyProgramAddress } from "./useUrl"
import { useContractLogs } from "./useContractLogs"
import { useTokenMetadata } from "./useTokenMetadata"
import { loyaltyProgramAbi } from "@/context/abi"
import { useRef } from "react"
import { parseContractLogs } from "../utils/parsers"
import { LoyaltyProgramMetadata } from "@/types"


export const useLoyaltyPrograms = () => {

  let { address } = useAccount()
  const { progAddress } = useLoyaltyProgramAddress()

  const status = useRef<"loading" | "error" | "success">() 
  status.current = "loading"
  const loggedIn = useRef<boolean>()
  loggedIn.current = true

  // checking address
  if (address == undefined ) {
    address = "0x0000000000000000000000000000" // double check if this not ALSO makes that ALL contracts are loaded... YES: you get an error.  
    loggedIn.current = false
    status.current = "error"
  }

  // Step 1: retrieving contract addresses of loyalty programs owned by user. 
  // NB: need to include Redux save & check here! -- Do I though? network load seems absolutely tiny. -- keep it simple... 
  const {data} = useContractLogs(
    { 
      abi: loyaltyProgramAbi, 
      eventName: 'DeployedLoyaltyProgram', 
      args: {owner: address}, 
      fromBlock: 1n,
      toBlock: 16330050n
    }
  )
  
  const loyaltyProgramsData = parseContractLogs(data)
  const loyaltyProgramsAddresses = loyaltyProgramsData.map(program => program.address)
  console.log("loyaltyProgramsADDRESSES from useContractLogs at useLoyaltyProgram: ", loyaltyProgramsAddresses)

  // step 2: retrieve metadata of users loyalty programs. 
  let loyaltyPrograms = useTokenMetadata(loyaltyProgramsAddresses)
  
  console.log("loyaltyPrograms METADATA from useTokenMetadata at useLoyaltyProgram: ", loyaltyPrograms)

  let indexProgram: number = data.findIndex(item => item.address === progAddress); // naming of const's is still a bit ... iffy. progAddress should maybe be selectedLoyaltyProgram

  loyaltyPrograms ? status.current = "success" : status.current = "error"  

  return {
    loggedIn: loggedIn.current,
    // loyaltyPrograms: loyaltyPrograms.current, 
    indexProgram: indexProgram, 
    status: status.current
  }

}

