"use client";

import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import VoucherSmall from "./VoucherSmall";
import { LoyaltyToken } from "@/types";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyGiftAbi, loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { parseBigInt, parseEthAddress, parseTransferSingleLogs } from "@/app/utils/parsers";
import { useAppSelector } from "@/redux/hooks";
import RedeemVoucher from "./RedeemVoucher";
import { notification } from "@/redux/reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";
import { useLatestCustomerTransaction } from "@/app/hooks/useLatestTransaction";
import Image from "next/image";
import { DynamicLayout } from "../components/DynamicLayout";

type setSelectedVoucherProps = {
  token: LoyaltyToken; 
  disabled: boolean;
}

export default function Page() {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram)
  const { status, loyaltyTokens, fetchTokens } = useLoyaltyTokens()
  const [ claimedVouchers, setClaimedVouchers ] = useState<LoyaltyToken[] | undefined>() 
  const [selectedVoucher, setSelectedVoucher] = useState<setSelectedVoucherProps | undefined>() 
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>() 
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const {address} = useAccount() 
  const publicClient = usePublicClient()
  const dispatch = useDispatch() 
  const { tokenReceived, tokenSent, latestSent } = useLatestCustomerTransaction() 

  console.log("claimedVouchers: ", claimedVouchers)

  const getLoyaltyCardPoints = async () => {
    console.log("getLoyaltyCardPoints called") 
      if (selectedLoyaltyCard) {
      const loyaltyCardPointsData = await publicClient.readContract({
        address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
        abi: loyaltyProgramAbi,
        functionName: 'getBalanceLoyaltyCard', 
        args: [ selectedLoyaltyCard?.cardAddress ]
      });

      console.log("loyaltyCardPointsData: ", loyaltyCardPointsData)
      
      const loyaltyCardPoints = parseBigInt(loyaltyCardPointsData)
      setLoyaltyPoints(Number(loyaltyCardPoints))
    }
  }
  
  useEffect(() => {
    if (!loyaltyPoints && selectedLoyaltyProgram?.programAddress) getLoyaltyCardPoints()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ , loyaltyPoints, selectedLoyaltyProgram?.programAddress ])

  const getClaimedLoyaltyVouchers = async () => {
    console.log("getClaimedLoyaltyVouchers called")
    console.log("latestSent @redeem token: ", latestSent)

    const claimedVouchersLogs: Log[] = await publicClient.getContractEvents({
      // address: loyaltyToken.tokenAddress, 
      abi: loyaltyGiftAbi,
      eventName: 'TransferSingle', 
      args: {
        to: selectedLoyaltyCard?.cardAddress
      },
      fromBlock: 5200000n
    })
    const claimedVouchers = parseTransferSingleLogs(claimedVouchersLogs)

    const redeemedVouchersLogs: Log[] = await publicClient.getContractEvents({
      // address: loyaltyToken.tokenAddress, 
      abi: loyaltyGiftAbi,
      eventName: 'TransferSingle', 
      args: {
        from: selectedLoyaltyCard?.cardAddress
      },
      fromBlock: 5200000n
    })
    const redeemedVouchers = parseTransferSingleLogs(redeemedVouchersLogs)
    
    // const transactionTo = claimedVouchersData.filter(claimedVoucher => 
    //   claimedVoucher.to == selectedLoyaltyCard?.cardAddress
    // )
    // const transactionFrom = claimedVouchersData.filter(claimedVoucher => 
    //   claimedVoucher.from == selectedLoyaltyCard?.cardAddress 
    // )

    if (loyaltyTokens) {
      let claimedVouchersTemp: LoyaltyToken[] = [] 

      loyaltyTokens.forEach(loyaltyToken => { 
        
        const addedVoucher = claimedVouchers.filter(
          event => event.address == loyaltyToken.tokenAddress && Number(event.ids[0]) == loyaltyToken.tokenId
          ).length 
        const removedVoucher = redeemedVouchers.filter(
          event => event.address == loyaltyToken.tokenAddress && Number(event.ids[0]) == loyaltyToken.tokenId
          ).length

        for (let i = 0; i < (addedVoucher - removedVoucher); i++) {
          claimedVouchersTemp.push(loyaltyToken)
        }
      })
      setClaimedVouchers(claimedVouchersTemp)
    }  
  }
    
  useEffect(() => {
      getClaimedLoyaltyVouchers() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ , loyaltyTokens, address, selectedVoucher])

  useEffect(() => {
    fetchTokens() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ])

  useEffect(() => {
    if (tokenSent) {
      dispatch(notification({
        id: "tokenTransfer",
        message: `Voucher id ${tokenSent.ids[0]} successfully redeemed.`, 
        colour: "green",
        isVisible: true
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenSent])

  return (
    // <DynamicLayout>
     <div className=" w-full h-full flex flex-col content-start overflow-auto">

      <div className="h-fit m-3 break-words"> 
        <TitleText title = "Your Card" subtitle={`#${selectedLoyaltyCard?.cardId} | ${selectedLoyaltyCard?.loyaltyProgramAddress}`} size={2} />
      </div>
      <div className="grid grid-cols-1 justify-items-center"> 
        <p className="pt-0 w-5/6 sm:w-1/2 text-lg text-center text-bold border-b border-slate-800 dark:border-slate-200 p-1">
          {`${loyaltyPoints} Loyalty Points`}
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
              setHashTransaction(undefined)}
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
      !selectedVoucher && status == "isLoading" ? 
            <div className="grow flex flex-col self-center items-center justify-center text-slate-800 dark:text-slate-200 z-40">
              <Image
                className="rounded-lg flex-none mx-3 animate-spin self-center"
                width={60}
                height={60}
                src={"/images/loading2.svg"}
                alt="Loading icon"
              />
            </div>
        :
        !selectedVoucher && status == "isSuccess" ? 
          <>
            <div className="grid grid-cols-2  overflow-auto sm:grid-cols-3 md:grid-cols-4 p-4 pt-0 justify-items-center content-start">
              

              { claimedVouchers && claimedVouchers.length > 0 ?
              
              claimedVouchers.map((token: LoyaltyToken, i) => 
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
    // </DynamicLayout>
  );
}

