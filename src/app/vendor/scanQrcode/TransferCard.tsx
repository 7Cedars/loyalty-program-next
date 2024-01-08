// TODO 

import { Dispatch, SetStateAction } from "react";
import { EthAddress, QrData, Transaction } from "@/types";
import { Button } from "@/app/ui/Button";
import { 
  useContractWrite, 
  useWaitForTransaction, 
  useAccount, 
  useContractRead, 
  usePublicClient 
} from "wagmi";
import { parseEthAddress, parseTransferSingleLogs, parseBigInt } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi"; 
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { notification } from "@/redux/reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Log } from "viem";
import { bigIntMax } from "@/app/utils/bigIntOperations";
import { TitleText } from "@/app/ui/StandardisedFonts";
import Image from "next/image";

type RedeemTokenProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}
// use Setdata to reset qrdata when action is completed. 

export default function TransferCard({qrData, setData}: RedeemTokenProps)  {
  const { progAddress } =  useUrlProgramAddress();
  const [ hashTransaction, setHashTransaction] = useState<any>() 
  const [ transferSingles, setTransferSingles ] = useState<Transaction[] | undefined>()
  const [ lastCardTransferred, setLastCardTransferred] = useState<BigInt | undefined>() 
  const [customerAddress, setCustomerAddress] = useState<EthAddress | undefined >() 
  const dispatch = useDispatch() 
  const { address } = useAccount() 
  const publicClient = usePublicClient()

  // const getTransferSingleData = async () => {
  //   console.log("getTransferSingleData called")

  //   const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
  //     abi: loyaltyProgramAbi, 
  //     address: parseEthAddress(progAddress), 
  //     eventName: 'TransferSingle', 
  //     args: {
  //       from: parseEthAddress(address)
  //     },
  //     fromBlock: 1n,
  //     toBlock: 16330050n
  //   });

  //   setTransferSingles(parseTransferSingleLogs(transferSingleLogs))
  
  // }

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
      },
    }
  )

  const transferCard = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "safeTransferFrom", 
      args: [address, customerAddress, 9n, 1n, ""], 
      onError(error) {
        dispatch(notification({
          id: "transferLoyaltyCard",
          message: `Something went wrong. Loyalty card has not been transferred.`, 
          colour: "red",
          isVisible: true
        }))
        console.log('transferLoyaltyCard Error', error)
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

  useEffect(() => {

    if (transferSingles) {
      const transferredLoyaltyCards = transferSingles.map(item => item.ids[0])
      setLastCardTransferred(bigIntMax(transferredLoyaltyCards))
    }

    setCustomerAddress(qrData?.customerAddress)
  }, [qrData?.customerAddress, transferSingles])

  return (
    <div className="grid grid-cols-1 ">

      <TitleText title = "Transfer Loyalty Card" subtitle="Transfer a single card to a customer." size = {2} />

      { loyaltyCardsMinted.isSuccess && lastCardTransferred ? 

        <div className="text-center p-3 pt-12">
          Approximately  
          <b> {` ${ Number(parseBigInt(loyaltyCardsMinted.data)) - Number(lastCardTransferred) } `} </b>
          Loyalty Cards remaining
        </div>
        : null 
      }

      {customerAddress && lastCardTransferred ? 

        <div className="p-3 mx-12 px-12 flex-col m-3" > 
          <div className="flex justify-center items-center italic">
            Loyalty Card requested by 
          </div>
          <div className="flex justify-center items-center">
            {customerAddress}
          </div> 
        
        { isLoading ? 
          <div className="p-3 px-12 flex m-3"> 
            <Button appearance = {"grayEmpty"} onClick={() => {}} >
              <div className="flex justify-center items-center">
                <Image
                  className="rounded-lg opacity-25 flex-none mx-3 animate-spin"
                  width={30}
                  height={30}
                  src={"/loading.svg"}
                  alt="Loading icon"
                />
                Waiting for confirmation (this can take a few minutes...)
              </div>
            </Button>
          </div> 
          :
          <div className="p-3 px-12 flex">
            <Button onClick={ transferCard.write } appearance="blueFilled">
              <div className="flex justify-center items-center">
                Transfer Loyalty Card
              </div>
            </Button>
          </div>
          }
          <div className="p-3 px-12 flex">
            <Button onClick={() => {setData(undefined)}}>
              <div className="flex justify-center items-center">
                Back to QR reader
              </div>
            </Button>
          </div>

        </div> 
      : 
      null 
    }
    </div>
    )
  } 