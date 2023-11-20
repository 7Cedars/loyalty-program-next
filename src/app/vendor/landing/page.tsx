"use client"; 
import { ModalDialog } from '@/app/ui/ModalDialog';
import {loyaltyProgramAbi} from "../../../context/abi" 
import { useAccount, useConnect, useDisconnect, useBalance, usePublicClient, useContractEvent } from 'wagmi'
import { useContractLogs } from '@/app/hooks/useContractLogs';
import { CreateContractEventFilterParameters } from 'viem'; 

export default function Page()  {
  const { address } = useAccount()
  let parameters: CreateContractEventFilterParameters = {abi: loyaltyProgramAbi} 

  address ? parameters = 
    { ... parameters,
      eventName: 'DeployedLoyaltyProgram',
      fromBlock: 1n,
      toBlock: 16330050n 
    } 
    :
    { ... parameters,
      eventName: 'DeployedLoyaltyProgram',
      args: {owner: address}, 
      fromBlock: 1n,
      toBlock: 16330050n 
    } 

  const {data, isError, isLoading} = useContractLogs(parameters)

  if (data) 
  { 
    if (data.length == 0) {return (
      <div> Zero deployed contract. Invite to deploy program here </div>
    )}
    if (data.length == 1) {return (
      <div> One deployed contract. Login </div>
    )}
    if (data.length > 1) {return (
      <div> Multiple deployed contracts. choose </div>
    )}
  }


  const printDeployedPrograms = deployedPrograms.map(program => {
    return (
      <div> 

      </div>
    )
  })



  let text = "TEST TEST"
  if (isLoading) text = "loading balance." 
  if (isError) text = "error fetching balance."
  if (data) text = `Balance: ${data.symbol} ${data.value}` 

  return (
    <ModalDialog>
    <div className="h-screen w-full flex flex-row space-x-0">
      <div className='mt-20 w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
        {text}
      </div>
      
      <div className='mt-20 flex-grow space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        Two
      </div> 
    </div> 
    </ModalDialog>
  );
}
