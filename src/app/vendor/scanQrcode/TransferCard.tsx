import { Dispatch, SetStateAction } from "react";
import { EthAddress, QrData, Transaction } from "@/types";
import { Button } from "@/app/ui/Button";
import { 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useAccount, 
  useReadContract, 
  usePublicClient 
} from "wagmi";
import { parseEthAddress, parseTransferSingleLogs, parseBigInt } from "@/app/utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi"; 
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Log } from "viem";
import { bigIntMax } from "@/app/utils/bigIntOperations";
import { TitleText } from "@/app/ui/StandardisedFonts";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import MintCards from "../vendorComponents/MintCards";
import { SUPPORTED_CHAINS } from "@/context/constants";
import { useVendorAccount } from "@/app/hooks/useVendorAccount";

type RedeemTokenProps = {
  qrData: QrData | undefined;  
  setData: Dispatch<SetStateAction<QrData | undefined>>; 
}

export default function TransferCard({qrData, setData}: RedeemTokenProps)  {
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram)
  const [ hashTransaction, setHashTransaction] = useState<any>() 
  const [ modal, setModal] = useState<"points" | "cards" | undefined>() 
  const [ transferSingles, setTransferSingles ] = useState<Transaction[] | undefined>()
  const [ lastCardTransferred, setLastCardTransferred] = useState<BigInt | undefined>() 
  const [customerAddress, setCustomerAddress] = useState<EthAddress | undefined >() 
  const { height, width } = useScreenDimensions()
  const { balances, refetchBalances } = useVendorAccount() 
  const { writeContract,  isError: isErrorWriteContract, isSuccess: isSuccessWriteContract } = useWriteContract()
  const dispatch = useDispatch() 
  const { address, chain } = useAccount() 
  const publicClient = usePublicClient()

  const getTransferSingleData = async () => {
    if (publicClient && chain) {
      const selectedChain: any = SUPPORTED_CHAINS.find(block => block.chainId === chain.id)
      const transferSingleLogs: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'TransferSingle', 
        args: {
          from: parseEthAddress(address)
        },
        fromBlock: selectedChain?.fromBlock
      });
      setTransferSingles(parseTransferSingleLogs(transferSingleLogs))
    }
  }

  useEffect(() => {
    if (isErrorWriteContract) {
      dispatch(notification({
        id: "transferLoyaltyCard",
        message: `Something went wrong. Loyalty card has not been transferred.`, 
        colour: "red",
        isVisible: true
      }))
    }
  }, [isErrorWriteContract])

  useEffect(() => {
    if (isSuccessWriteContract)  {
      setHashTransaction(data)
      refetchBalances() 
    }
  }, [isSuccessWriteContract])

  const { data, isError, isLoading, isSuccess } = useWaitForTransactionReceipt(
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
    refetchBalances()
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
      if (
        balances && 
        balances?.cards == 0 ) {
            dispatch(notification({
              id: "insufficientCards",
              message: `You do not have any Loyalty Cards. Mint some on the Stats page.`, 
              colour: "yellow",
              isVisible: true
            }))
        }
      if (
        balances && 
        balances?.cards < 0 ) {
            dispatch(updateNotificationVisibility({
              id: "insufficientCards",
              isVisible: false
            }))
        }
    }, [ , balances])

  return (
    <div className=" w-full grid grid-cols-1 gap-1 overflow-x-auto">

      <div className="h-16 m-1"> 
        <TitleText title = "Transfer Loyalty Card" subtitle="Transfer a single card to a customer." size = {2} />
      </div>

      <div className="flex justify-center"> 
        <p className="p-2 w-1/2 text-center border-b border-slate-700">
          {balances  ? ` ${ balances.cards } loyalty cards left.` : ''}
        </p>
      </div>
        
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
              <MintCards /> 
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
                  <Button appearance = {"grayEmpty"} disabled >
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
                  <Button appearance="greenEmpty" onClick={() => writeContract({ 
                    abi: loyaltyProgramAbi,
                    address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
                    functionName: "safeTransferFrom", 
                    args: [address, customerAddress,  Number(lastCardTransferred) + 1, 1, ""]
                    })} >
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