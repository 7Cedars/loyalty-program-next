"use client"; 
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./GiftSmall";
import { TokenBig } from "./GiftBig";
import { LoyaltyGift, Status } from "@/types";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { useAccount, usePublicClient } from 'wagmi'
import { 
  parseEthAddress, 
  parseBigInt,
  parseLoyaltyGiftLogs
} from "@/app/utils/parsers";
import { useAppSelector } from "@/redux/hooks";
import { useLoyaltyGifts } from "@/app/hooks/useLoyaltyGifts";
import { useLatestCustomerTransaction } from "@/app/hooks/useLatestTransaction";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { selectLoyaltyCard } from "@/redux/reducers/loyaltyCardReducer";
import Image from "next/image";
import { SUPPORTED_CHAINS } from "@/context/constants";

type setSelectedTokenProps = {
  token: LoyaltyGift; 
  disabled: boolean; 
}

export default function Page() {
  const {chain} = useAccount()
  const dispatch = useDispatch() 
  const publicClient = usePublicClient()
  const { status: statusLoyaltyGifts, loyaltyGifts, fetchGifts } = useLoyaltyGifts()

  console.log("loyaltyGifts @claimGift" , loyaltyGifts)

  const statusAtAddedGifts = useRef<Status>("isIdle") 
  const statusAtClaimableGifts = useRef<Status>("isIdle") 
  const status = useRef<Status>("isIdle") 

  const [data, setData] = useState<LoyaltyGift[]>()
  
  const [ selectedToken, setSelectedToken ] = useState<setSelectedTokenProps | undefined>() 
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram)
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const polling = useRef<boolean>(false)
  const { tokenReceived, latestReceived, pointsReceived, pointsSent } = useLatestCustomerTransaction(polling.current) 

  /////////////////////////////////// 
  ///     Fetch Card Balance      ///
  ///////////////////////////////////

  const fetchCardBalance = async () => {
    if (selectedLoyaltyCard && publicClient)
      try {
        const loyaltyCardPoints = await publicClient.readContract({
          address: parseEthAddress(selectedLoyaltyCard.loyaltyProgramAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'getBalanceLoyaltyCard', 
          args: [ selectedLoyaltyCard.cardAddress ]
        });
        const updatedLoyaltyCard = {...selectedLoyaltyCard, balance: Number(parseBigInt(loyaltyCardPoints))}
        dispatch(selectLoyaltyCard(updatedLoyaltyCard))

        } catch (error) {
          console.log(error)
      }
  }

  // to refetch: set balance to undefined. 
  useEffect(() => { 
    if (selectedLoyaltyCard && selectedLoyaltyCard.balance == undefined) fetchCardBalance() 
  }, [selectedLoyaltyCard])


  ///////////////////////////////////
  ///         Fetch Gifts         ///
  ///////////////////////////////////

  const getAddedGifts = async () => {
    statusAtAddedGifts.current = "isLoading"
    status.current = "isLoading"

    if (publicClient && chain)
    
    try {
      const selectedChain: any = SUPPORTED_CHAINS.find(block => block.chainId === chain.id)
      console.log("selectedChain: ", selectedChain)
      const addedGifts: Log[] = await publicClient.getContractEvents( { 
        abi: loyaltyProgramAbi, 
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        eventName: 'AddedLoyaltyGift', 
        fromBlock: selectedChain?.fromBlock
      }); 
      const addedGiftsEvents: LoyaltyGift[] = Array.from(new Set(parseLoyaltyGiftLogs(addedGifts))) 
      statusAtAddedGifts.current = "isSuccess"
      setData(addedGiftsEvents)

    } catch (error) {
      statusAtAddedGifts.current = "isError"
      status.current = "isError"
      console.log(error)
    }
  }

  const getClaimableGifts = async () => {
    statusAtClaimableGifts.current = "isLoading"

    let loyaltyGift: LoyaltyGift
    let loyaltyGiftsUpdated: LoyaltyGift[] = []

    if (data && publicClient) { 
      try {
        for await (loyaltyGift of data) {
          const isClaimable: unknown = await publicClient.readContract({
            address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
            abi: loyaltyProgramAbi,
            functionName: 'getLoyaltyGiftsIsClaimable', 
            args: [loyaltyGift.giftAddress, loyaltyGift.giftId]
          })
          isClaimable == 1n ? loyaltyGiftsUpdated.push(loyaltyGift) : null
        }
        statusAtClaimableGifts.current = "isSuccess" 
        setData(loyaltyGiftsUpdated) 
      } catch (error) {
        statusAtClaimableGifts.current = "isError" 
        status.current = "isError"
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if (statusAtAddedGifts.current == "isIdle") getAddedGifts()
  }, [, statusAtAddedGifts ] ) 

  useEffect(() => {
    if (selectedToken) polling.current = true
    else polling.current = false   
  }, [, selectedToken ] )

  useEffect(() => {
    if (
      data && 
      statusAtAddedGifts.current == "isSuccess" &&
      statusAtClaimableGifts.current == "isIdle"
      ) getClaimableGifts() 
  }, [ statusAtAddedGifts, statusAtClaimableGifts, data ] )

  useEffect(() => {
    if (
      data && 
      statusAtAddedGifts.current == "isSuccess" &&
      statusAtClaimableGifts.current == "isSuccess"
      ) { 
        fetchGifts(data)
        status.current = "isSuccess"
      } 
  }, [ statusAtAddedGifts, statusAtClaimableGifts, data ])

  useEffect(() => {
    fetchCardBalance() 
    if (tokenReceived) {
      polling.current = false
      
      dispatch(notification({
        id: "claimLoyaltyGift",
        message: `Success! You received a new voucher. You can see it in the Your Card tab.`, 
        colour: "green",
        isVisible: true
      }))
    }
  }, [tokenReceived])

  return (
    // <DynamicLayout>
     <div className="w-full h-full grid grid-cols-1 gap-1 content-start overflow-x-auto">

      <div className="h-30">
        <div className="m-1 h-20"> 
        <TitleText title = "Claim Gifts" subtitle="Claim gifts and vouchers with your loyalty points." size={2} />
        </div>

        <div className="flex justify-center"> 
          <p className="p-2 pt-4 w-1/2 text-center border-b border-slate-700">
            {`${selectedLoyaltyCard?.balance} loyalty points`}
          </p>
        </div>
      </div>

      { selectedToken ? 
      <div className="grid grid-cols-1 content-start">
        <div className=" border border-gray-300 rounded-lg m-1">
          <button 
            className="text-slate-800 dark:text-slate-200 font-bold p-2 grid grid-cols-1 content-start"
            type="submit"
            onClick={() => setSelectedToken(undefined)} // should be true / false
            >
            <ArrowLeftIcon
              className="h-7 w-7"
              aria-hidden="true"
            />
          </button>

          <TokenBig token={selectedToken.token} disabled = {selectedToken.disabled} /> 
          
          {/* <div className="h-32" />  */}
          
        </div>
       
      </div>
      :
      <>
      <div className="overflow-y-auto">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">
          <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "Available Gifts" size={0} />
          </div>
          
          
          { 
          statusLoyaltyGifts === "isLoading" || 
          status.current  === "isLoading" ? 
          
            <div className="mt-12 col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 h-full flex flex-col w-full self-center items-center justify-center text-slate-800 dark:text-slate-200 z-40"> 
                <Image
                  className="rounded-lg mx-3 animate-spin grow self-center"
                  width={60}
                  height={60}
                  src={"/images/loading2.svg"}
                  alt="Loading icon"
                />
                <div className="grow text-center text-slate-500 mt-6">
                  Retrieving vendor gifts... 
                </div>
            </div> 
          :
          statusLoyaltyGifts === "isSuccess" && 
          loyaltyGifts ?
            loyaltyGifts.map((gift: LoyaltyGift) => 
                gift.metadata ? 
                <div key = {`${gift.giftAddress}:${gift.giftId}`} >
                  <TokenSmall token = {gift} disabled = {false} onClick={() => setSelectedToken({token: gift, disabled: false})}  /> 
                </div>
                : null 
              )
          : 
          statusLoyaltyGifts === "isSuccess" && !loyaltyGifts ?
            <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
              <NoteText message="No gifts available. Ask vendor to enable gifts."/>
            </div>
          : 
          null
          }
          </div>
        </div> 
      </>

    }
    </div>   
  );
}
