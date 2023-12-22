// TODO 

import { Dispatch, SetStateAction } from "react";
import { QrData } from "@/types";
import { Button } from "@/app/ui/Button";
import { 
  useContractWrite, 
  useWaitForTransaction, 
  useAccount, 
  useContractRead, 
  usePublicClient 
} from "wagmi";
import { parseEthAddress } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi"; 
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { notification } from "@/redux/reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Log } from "viem";

type RedeemTokenProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}
// use Setdata to reset qrdata when action is completed. 

export default function TransferCard({qrData, setData}: RedeemTokenProps)  {
  const { progAddress } =  useUrlProgramAddress();
  const [ hashTransaction, setHashTransaction] = useState<any>() 
  const dispatch = useDispatch() 
  const { address } = useAccount() 
  const publicClient = usePublicClient()

  const getTransferredLoyaltyCards = async () => {

    const addedTokensData: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle', 
      args: {
        from: address,
        to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac', 
        id: !0
      },
      fromBlock: 1n,
      toBlock: 16330050n
    });
  }


  const loyaltyCardsMinted = useContractRead(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "getNumberLoyaltyCardsMinted", 
      args: [], 
      onError(error) {
        dispatch(notification({
          id: "getNumberLoyaltyCardsMinted",
          message: `Something went wrong. Data did not load.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('addLoyaltyToken Error', error)
      }, 
      onSuccess(data: any) {
        console.log("data from getNumberLoyaltyCardsMinted: ", data)
        // setHashTransaction(data.hash)
      },
    }
  )

  const transferCard = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "safeTransferFrom", 
      args: [address, qrData?.customerAddress, , 1], 
      onError(error) {
        dispatch(notification({
          id: "addLoyaltyTokenContract",
          message: `Something went wrong. Loyalty gift has not been added.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('addLoyaltyToken Error', error)
      }, 
      onSuccess(data) {
        setHashTransaction(data.hash)
      },
    }
  )

  const { data, isError, isLoading, isSuccess } = useWaitForTransaction(
    { 
      confirmations: 1,
      hash: hashTransaction 
    })

  return (
    <div className="grid grid-cols-1 ">
  
      <div className="text-center p-3 pt-12">
      <Button onClick={() => {loyaltyCardsMinted}}>
          Loyalty Cards Minted
        </Button>
      
        {/* TRANSFER CARD */}
      </div>

      <div className="text-center p-3 pt-12" >
        <Button onClick={() => {setData(undefined)}}>
          Back to QR reader
        </Button>
      </div>
  
    </div>
    )
  } 