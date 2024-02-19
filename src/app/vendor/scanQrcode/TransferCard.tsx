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
import { useAppSelector } from "@/redux/hooks";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import MintCards from "../components/MintCards";

type RedeemTokenProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}
// use Setdata to reset qrdata when action is completed. 

export default function TransferCard({qrData, setData}: RedeemTokenProps)  {
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram)
  const { progAddress } =  useUrlProgramAddress();
  const [ hashTransaction, setHashTransaction] = useState<any>() 
  const [ modal, setModal] = useState<"points" | "cards" | undefined>() 
  const [ transferSingles, setTransferSingles ] = useState<Transaction[] | undefined>()
  const [ lastCardTransferred, setLastCardTransferred] = useState<BigInt | undefined>() 
  const [customerAddress, setCustomerAddress] = useState<EthAddress | undefined >() 
  const { height, width } = useScreenDimensions()
  const dispatch = useDispatch() 
  const { address } = useAccount() 
  const publicClient = usePublicClient()

  console.log("transferSingles: ", transferSingles) 

  const getTransferSingleData = async () => {
    console.log("getTransferSingleData called")

    const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle', 
      args: {
        from: parseEthAddress(address)
      },
      fromBlock: 5200000n
    });

    setTransferSingles(parseTransferSingleLogs(transferSingleLogs))
  
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
      },
    }
  )

  const transferCard = useContractWrite(
    {
      address: parseEthAddress(progAddress),
      abi: loyaltyProgramAbi,
      functionName: "safeTransferFrom", 
      args: [address, customerAddress,  Number(lastCardTransferred) + 1, 1, ""], 
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
    if (isSuccess) {
      dispatch(notification({
        id: "transferLoyaltyCard",
        message: `Success! Card with Id ${Number(lastCardTransferred) + 1} transferred.`, 
        colour: "green",
        isVisible: true
      }))
    }
  }, [isSuccess])

  useEffect(() => {

    if (transferSingles && transferSingles.length > 0) {
      const transferredLoyaltyCards = transferSingles.map(item => item.ids[0])
      setLastCardTransferred(bigIntMax(transferredLoyaltyCards))
    } else {
      setLastCardTransferred(1n)
    }

    setCustomerAddress(qrData?.customerAddress)
  }, [, qrData?.customerAddress, transferSingles])

  useEffect(() => {
    getTransferSingleData()
  }, [])

  console.log(
    "Data prior to render:", 
    {
    customerAddress: customerAddress,
    lastCardTransferred: lastCardTransferred, 
    loyaltyCardsMinted: loyaltyCardsMinted, 
    selectedLoyaltyProgram: selectedLoyaltyProgram
  })

  return (
    <div className=" w-full grid grid-cols-1 gap-1 overflow-x-auto">

      <div className="h-16 m-1"> 
        <TitleText title = "Transfer Loyalty Card" subtitle="Transfer a single card to a customer." size = {2} />
      </div>

      { loyaltyCardsMinted.data ? 
        <div className="flex justify-center"> 
          <p className="p-2 w-1/2 text-center border-b border-slate-700">
            {`${ Number(parseBigInt(loyaltyCardsMinted?.data)) - Number(lastCardTransferred)} loyalty cards left.`}
          </p>
        </div>
        :
        <MintCards modal = {modal} setModal = {setModal} /> 
      }

      {customerAddress ? 

        <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-3" > 
          <div className="w-full flex"> 
            <button 
              className="text-slate-800 dark:text-slate-200 font-bold p-3"
              type="submit"
              onClick={() => {
                setData(undefined) 
                setHashTransaction(undefined)}
              } 
              >
              <ArrowLeftIcon
                className="h-7 w-7"
                aria-hidden="true"
              />
            </button>
          </div>

          { modal === 'cards' ? 
            <div> 
              <MintCards modal = {modal} setModal = {setModal} /> 
            </div>
            : 
            null 
          }

          { selectedLoyaltyProgram && selectedLoyaltyProgram.metadata && modal == undefined ? 
          <div className=" grid grid-cols-1 sm:grid-cols-2 h-full w-full p-3 px-6 justify-items-center">
            <div className="rounded-lg"> 
              <Image
                  className="rounded-lg h-full"
                  width={width < 896 ? (width - 75) / 3  : 250}
                  height={height / 3}
                  src={selectedLoyaltyProgram.metadata.imageUri}
                  alt="Loyalty Token icon "
                />
            </div>

            <div className="grid grid-cols-1 content-between ">
              {`Card requested by ${customerAddress.slice(0,6)}...${customerAddress.slice(36,42) }`}
              
              { isLoading ? 
                <div className="p-3 flex"> 
                  <Button appearance = {"grayEmpty"} onClick={() => {}} >
                    <div className="flex justify-center items-center">
                      <Image
                        className="rounded-lg opacity-25 flex-none mx-3 animate-spin"
                        width={30}
                        height={30}
                        src={"/images/loading2.svg"}
                        alt="Loading icon"
                      />
                      Waiting for confirmation (this can take a few minutes...)
                    </div>
                  </Button>
                </div> 
                :
                <div className="p-3 flex ">
                  <Button onClick={ transferCard.write } appearance="grayEmpty">
                      Transfer Loyalty Card
                  </Button>
                </div>
                }
              </div>
              
            </div> 
          : 
          null 
        }
          
        </div>
        : 
        null
      }
        <div className="flex w-full md:px-48 px-6">
          { modal === 'cards' ? 
          <Button onClick={() => {setModal(undefined)} } appearance="grayEmpty">
          <div className="justify-center items-center">
            Return to transfer card
          </div>
          </Button>
        :
          <Button onClick={() => {setModal('cards')} } appearance="grayEmpty">
            <div className="justify-center items-center">
              Mint Loyalty Cards
            </div>
          </Button>
        }
          
        </div> 
    </div>
    )
  } 