"use client";
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./TokenSmall";
import { LoyaltyToken } from "@/types";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { loyaltyGiftAbi, loyaltyProgramAbi } from "@/context/abi";
import { Log } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { parseBigInt, parseEthAddress, parseTransferSingleLogs } from "@/app/utils/parsers";
import { useAppSelector } from "@/redux/hooks";
import RedeemToken from "./RedeemToken";
import { notification } from "@/redux/reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useLoyaltyTokens } from "@/app/hooks/useLoyaltyTokens";
import { useLatestCustomerTransaction } from "@/app/hooks/useLatestTransaction";

type setSelectedTokenProps = {
  token: LoyaltyToken; 
  disabled: boolean; 
}

export default function Page() {
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { status, loyaltyTokens, fetchTokens } = useLoyaltyTokens()
  const [ claimedTokens, setClaimedTokens ] = useState<LoyaltyToken[] | undefined>() 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>() 
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const { progAddress } = useUrlProgramAddress() 
  const {address} = useAccount() 
  const publicClient = usePublicClient()
  const dispatch = useDispatch() 
  const { tokenReceived, tokenSent, latestSent } = useLatestCustomerTransaction() 

  const getLoyaltyCardPoints = async () => {
    console.log("getLoyaltyCardPoints called") 
      if (selectedLoyaltyCard) {
      const loyaltyCardPointsData = await publicClient.readContract({
        address: parseEthAddress(progAddress), 
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
    if (!loyaltyPoints) getLoyaltyCardPoints()
  }, [ , loyaltyPoints ])

  const getClaimedLoyaltyTokens = async () => {
    console.log("getClaimedLoyaltyTokens called")
    console.log("latestSent @redeem token: ", latestSent)

    const claimedTokensLogs: Log[] = await publicClient.getContractEvents({
      // address: loyaltyToken.tokenAddress, 
      abi: loyaltyGiftAbi,
      eventName: 'TransferSingle', 
      fromBlock: 1n,
      toBlock: 16330050n
    })
    const claimedTokensData = parseTransferSingleLogs(claimedTokensLogs)
    // console.log("claimedTokensLogs: ", claimedTokensLogs)

    const transactionTo = claimedTokensData.filter(claimedToken => 
      claimedToken.to == selectedLoyaltyCard?.cardAddress
    )
    const transactionFrom = claimedTokensData.filter(claimedToken => 
      claimedToken.from == selectedLoyaltyCard?.cardAddress 
    )

    if (loyaltyTokens) {
      let claimedTokensTemp: LoyaltyToken[] = [] 

      loyaltyTokens.forEach(loyaltyToken => { 
        
        const addedToken = transactionTo.filter(
          event => event.address == loyaltyToken.tokenAddress && Number(event.ids[0]) == loyaltyToken.tokenId
          ).length 
        const removedToken = transactionFrom.filter(
          event => event.address == loyaltyToken.tokenAddress && Number(event.ids[0]) == loyaltyToken.tokenId
          ).length

        for (let i = 0; i < (addedToken - removedToken); i++) {
          claimedTokensTemp.push(loyaltyToken)
        }
      })
      setClaimedTokens(claimedTokensTemp)
    }  
  }
    
  useEffect(() => {
      getClaimedLoyaltyTokens() 
  }, [ , loyaltyTokens, address, selectedToken])

  useEffect(() => {
    fetchTokens() 
  }, [ ])

  useEffect(() => {
    if (tokenSent) {
      dispatch(notification({
        id: "tokenTransfer",
        message: `Token id ${tokenSent.ids[0]} successfully redeemed.`, 
        colour: "green",
        isVisible: true
      }))
    }
  }, [tokenSent])

  return (
     <div className=" w-full h-full grid grid-cols-1 gap-1 content-start overflow-auto">

      <div className="h-fit m-3 break-words"> 
        <TitleText title = "Your Card" subtitle={`#${selectedLoyaltyCard?.cardId} | ${selectedLoyaltyCard?.loyaltyProgramAddress}`} size={2} />
      </div>
      <div className="grid grid-cols-1 justify-items-center"> 
        <p className="pt-0 w-full text-2xl text-center text-bold">
          {`${loyaltyPoints}`}
        </p>
        <p className="pb-2 w-1/2 text-center border-b border-blue-800 text-lg">
          {`Loyalty Points`}
        </p>
      </div>

      { selectedToken ? 
      <div className="grid grid-cols-1 content-start border border-gray-300 rounded-lg m-3">
        <button 
          className="text-black font-bold p-3"
          type="submit"
          onClick={() => {
            setSelectedToken(undefined) 
            setHashTransaction(undefined)}
          }  
          >
          <ArrowLeftIcon
            className="h-7 w-7"
            aria-hidden="true"
          />
        </button>
        { 
          selectedToken ?  
          <RedeemToken token={selectedToken?.token} disabled={false}  /> 
          : 
          <div> Loading ... </div>
        }
      </div>
      :
      <>
        <div className="grid grid-cols-1 mt-4"> 
          <TitleText title = "Vouchers" size={1} />
        </div>
        <div className="grid grid-cols-2  overflow-auto sm:grid-cols-3 md:grid-cols-4 p-4 pt-0 justify-items-center content-start">
          

          { claimedTokens && claimedTokens.length > 0 ?
          
          claimedTokens.map((token: LoyaltyToken, i) => 
              token.metadata ? 
              <div key = {i} >
                <TokenSmall token = {token} disabled = {false} onClick={() => setSelectedToken({token: token, disabled: false})}  /> 
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
    }
    
    </div> 
    
  );
}
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}

