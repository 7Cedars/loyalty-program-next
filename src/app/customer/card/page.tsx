"use client";

import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import VoucherSmall from "./VoucherSmall";
import { LoyaltyGift, Status } from "@/types";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { loyaltyGiftAbi, loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { parseBigInt, parseEthAddress, parseTransferSingleLogs } from "@/app/utils/parsers";
import { useAppSelector } from "@/redux/hooks";
import RedeemVoucher from "./RedeemVoucher";
import { notification } from "@/redux/reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useLoyaltyGifts } from "@/app/hooks/useLoyaltyGifts";
import { useLatestCustomerTransaction } from "@/app/hooks/useLatestTransaction";
import Image from "next/image";
import { selectLoyaltyCard } from "@/redux/reducers/loyaltyCardReducer";
import { SUPPORTED_CHAINS } from "@/context/constants";

type setSelectedVoucherProps = {
  token: LoyaltyGift; 
  disabled: boolean;
}

export default function Page() {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { status: statusLoyaltyGifts, loyaltyGifts, fetchGifts } = useLoyaltyGifts()
  const statusGetClaimedVouchers = useRef<Status>() 
  const [ claimedVouchers, setClaimedVouchers ] = useState<LoyaltyGift[] | undefined>() 
  const [selectedVoucher, setSelectedVoucher] = useState<setSelectedVoucherProps | undefined>() 
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const { address, chain } = useAccount() 
  const publicClient = usePublicClient()
  const dispatch = useDispatch() 
  const polling = useRef<boolean>(false) 
  const { tokenReceived, tokenSent, latestSent } = useLatestCustomerTransaction(polling.current) 

  ///////////////////////////////////
  ///     Fetch Card Balance      ///
  ///////////////////////////////////
  
  const fetchCardBalance = async () => {
    if (selectedLoyaltyCard && selectedLoyaltyCard.balance == undefined && publicClient)
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

  // refetch if balance is undefined. 
  useEffect(() => { 
    if (selectedLoyaltyCard && selectedLoyaltyCard.balance == undefined) fetchCardBalance() 
  }, [selectedLoyaltyCard])


  ///////////////////////////////////
  ///      Fetch  Vouchers        ///
  ///////////////////////////////////

  const getClaimedLoyaltyVouchers = async () => {
    statusGetClaimedVouchers.current = "isLoading"

    if (publicClient && chain) {
      const selectedChain: any = SUPPORTED_CHAINS.find(block => block.chainId === chain.id)
      try { 
        const claimedVouchersLogs: Log[] = await publicClient.getContractEvents({
          // address: loyaltyGift.giftAddress, 
          abi: loyaltyGiftAbi,
          eventName: 'TransferSingle', 
          args: {
            to: selectedLoyaltyCard?.cardAddress
          },
          fromBlock: selectedChain?.fromBlock
        })
        const claimedVouchers = parseTransferSingleLogs(claimedVouchersLogs)
  
        const redeemedVouchersLogs: Log[] = await publicClient.getContractEvents({
          // address: loyaltyGift.giftAddress, 
          abi: loyaltyGiftAbi,
          eventName: 'TransferSingle', 
          args: {
            from: selectedLoyaltyCard?.cardAddress
          },
          fromBlock: selectedChain?.fromBlock
        })
        const redeemedVouchers = parseTransferSingleLogs(redeemedVouchersLogs)
        
        if (loyaltyGifts) {
          let claimedVouchersTemp: LoyaltyGift[] = [] 
  
          loyaltyGifts.forEach(loyaltyGift => { 
            
            const addedVoucher = claimedVouchers.filter(
              event => event.address == loyaltyGift.giftAddress && Number(event.ids[0]) == loyaltyGift.giftId
              ).length 
            const removedVoucher = redeemedVouchers.filter(
              event => event.address == loyaltyGift.giftAddress && Number(event.ids[0]) == loyaltyGift.giftId
              ).length
  
            for (let i = 0; i < (addedVoucher - removedVoucher); i++) {
              claimedVouchersTemp.push(loyaltyGift)
            }
          })
          setClaimedVouchers(claimedVouchersTemp)
          statusGetClaimedVouchers.current = "isSuccess"
        }
      } catch (error) {
        statusGetClaimedVouchers.current = "isError"
        console.log(error)
      }  
    }
  }
    
  useEffect(() => {
    if (statusLoyaltyGifts == "isSuccess" && loyaltyGifts) getClaimedLoyaltyVouchers() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ , loyaltyGifts, statusLoyaltyGifts, address])

  useEffect(() => {
    if (!loyaltyGifts && statusLoyaltyGifts != "isLoading") fetchGifts() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ , loyaltyGifts ])

  useEffect(() => {
    if (!loyaltyGifts && statusLoyaltyGifts != "isLoading") fetchGifts() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ , loyaltyGifts ])

  useEffect(() => {
    if (selectedVoucher) polling.current = true 
  }, [selectedVoucher])

  return (
     <div className=" w-full h-full flex flex-col content-start overflow-auto">

      <div className="h-fit m-3 break-words"> 
        <TitleText title = "Your Card" subtitle={`#${selectedLoyaltyCard?.cardId} | ${selectedLoyaltyCard?.cardAddress} @${selectedLoyaltyCard?.loyaltyProgramAddress}`} size={2} />
      </div>
      <div className="grid grid-cols-1 justify-items-center"> 
        <p className="pt-0 w-5/6 sm:w-1/2 text-lg text-center text-bold border-b border-slate-800 dark:border-slate-200 p-1">
          {`${selectedLoyaltyCard?.balance} Loyalty Points`}
        </p>
        <div className="grid grid-cols-1 mt-4"> 
          <TitleText title = "Vouchers" size={1} />
        </div>
      </div>

      { selectedVoucher ? 
        <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-3">
          <button 
            className="text-slate-800 dark:text-slate-200 font-bold p-3"
            type="submit"
            onClick={() => {
              setSelectedVoucher(undefined) 
              setHashTransaction(undefined)
              polling.current = false 
            }
            }  
            >
            <ArrowLeftIcon
              className="h-7 w-7"
              aria-hidden="true"
            />
          </button>
            
          <RedeemVoucher token={selectedVoucher?.token} disabled={false}  /> 
            
        </div>
      :
      !selectedVoucher && 
      ( 
        statusLoyaltyGifts == "isLoading" || 
        statusGetClaimedVouchers.current == "isLoading"
      )  ? 
            <div className="grow flex flex-col self-center items-center justify-center text-slate-800 dark:text-slate-200 z-40">
              <Image
                className="rounded-lg flex-none mx-3 animate-spin self-center"
                width={60}
                height={60}
                src={"/images/loading2.svg"}
                alt="Loading icon"
              />
              <div className="text-center text-slate-500 mt-6">
                Retrieving your vouchers... 
              </div>
            </div>
        :
        !selectedVoucher && 
        statusLoyaltyGifts == "isSuccess" && 
        statusGetClaimedVouchers.current == "isSuccess" ? 
          <>
            <div className="grid grid-cols-2  overflow-auto sm:grid-cols-3 md:grid-cols-4 p-4 pt-0 justify-items-center content-start">
              

              { claimedVouchers && claimedVouchers.length > 0 ?
              
              claimedVouchers.map((token: LoyaltyGift, i) => 
                  token.metadata ? 
                  <div key = {i} >
                    <VoucherSmall token = {token} disabled = {false} onClick={() => setSelectedVoucher({token: token, disabled: false})}  /> 
                  </div>
                  : null 
                )
              : 
              <div className="col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
                <NoteText message="Vouchers will appear here."/>
              </div>
              }
            </div> 
        </>
        : null  
    }
    </div> 
  );
}

