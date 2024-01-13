"use client";
import { TitleText, NoteText } from "@/app/ui/StandardisedFonts";
import TokenSmall from "./TokenSmall";
import { LoyaltyToken } from "@/types";
import { useEffect, useState } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { ERC6551AccountAbi,  loyaltyTokenAbi } from "@/context/abi";
import { Hex, Log, encodeFunctionData } from "viem"
import { usePublicClient, useAccount } from 'wagmi'
import { parseEthAddress, parseTransferSingleLogs } from "@/app/utils/parsers";
import { useAppSelector } from "@/redux/hooks";
import RedeemToken from "./redeemToken";
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
  const { tokenIsSuccess, loyaltyTokens, fetchTokens } = useLoyaltyTokens()
  const [ claimedTokens, setClaimedTokens ] = useState<LoyaltyToken[] | undefined>() 
  const [selectedToken, setSelectedToken] = useState<setSelectedTokenProps | undefined>() 
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const { progAddress } = useUrlProgramAddress() 
  const {address} = useAccount() 
  const publicClient = usePublicClient()
  const dispatch = useDispatch() 
  const { tokenReceived, tokenSent, latestSent } = useLatestCustomerTransaction() 

  const getClaimedLoyaltyTokens = async () => {
    console.log("getClaimedLoyaltyTokens called")
    console.log("latestSent @redeem token: ", latestSent)

    let loyaltyToken: LoyaltyToken
    let claimedTokensTemp: LoyaltyToken[] = []

    if (tokenIsSuccess && loyaltyTokens) { 
      try {
        for await (loyaltyToken of loyaltyTokens) {

            const claimedTokensLogs: Log[] = await publicClient.getContractEvents({
              address: loyaltyToken.tokenAddress, 
              abi: loyaltyTokenAbi,
              eventName: 'TransferSingle', 
              fromBlock: 1n,
              toBlock: 16330050n
            })
            console.log("claimedTokensLogs: ", claimedTokensLogs)

            const claimedTokensData = parseTransferSingleLogs(claimedTokensLogs)
            const filteredData = claimedTokensData.filter(claimedToken => 
              claimedToken.from == selectedLoyaltyCard?.cardAddress ||  
              claimedToken.to == selectedLoyaltyCard?.cardAddress
              )
            console.log("filteredData: ", filteredData)

            if (filteredData) {
              claimedTokensTemp.push(...filteredData.map(
                  item => {
                    return ({...loyaltyToken, tokenId: Number(item.ids[0])})
                  }
                ))
              }
          }

          const claimedTokensUnique: LoyaltyToken[] = [] 
          claimedTokensTemp.forEach(
            (loyaltyToken: LoyaltyToken) => !claimedTokensUnique.find(
              (token: LoyaltyToken) => token.tokenId == loyaltyToken.tokenId
              ) ? claimedTokensUnique.push(loyaltyToken) : null
            )  
          
          setClaimedTokens(claimedTokensUnique)
          
        } catch (error) {
          console.log(error)
      }
    }
    
  }

  useEffect(() => {
      getClaimedLoyaltyTokens() 
  }, [ , loyaltyTokens, address, selectedToken])

  useEffect(() => {
    fetchTokens() 
  }, [ ])

  const approveTokenTransfer = useContractWrite(
    {
      address: parseEthAddress(selectedLoyaltyCard?.cardAddress),
      abi: ERC6551AccountAbi,
      functionName: "executeCall", 
      onError(error, context) {
        console.log('approveTokenTransfer Error', error, context)
      }, 
      onSuccess(data) {
        console.log("DATA approveTokenTransfer: ", data)
        setHashTransaction(data.hash)
      }, 
    }
  )

  const { isError, isLoading, isSuccess } = useWaitForTransaction(
    { 
      confirmations: 1,
      hash: hashTransaction 
    })

  useEffect(() => {
    if (isSuccess) {
      dispatch(notification({
        id: "tokenTransfer",
        message: `Token transfer authorised. Waiting for vendor to transfer...`, 
        colour: "yellow",
        isVisible: true
      }))
    }
    if (isError) {
      dispatch(notification({
        id: "tokenTransfer",
        message: `Something went wrong. Token not claimed.`, 
        colour: "red",
        isVisible: true
      }))
    }
   
  },[isError, isSuccess])

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



  const handleTokenSelect = (token: LoyaltyToken) => {
    setSelectedToken({token: token, disabled: false})
    
    const encodedFunctionCall: Hex = encodeFunctionData({
      abi: loyaltyTokenAbi, 
      functionName: 'setApprovalForAll', 
      args: [parseEthAddress(progAddress), true]
    })
      
    approveTokenTransfer.write({
      args: [token.tokenAddress, 0, encodedFunctionCall]
    })
  } 
  
  return (
     <div className=" w-full h-full grid grid-cols-1 gap-1 overflow-auto">

      <div className="h-20 m-3"> 
       <TitleText title = "Select Loyalty Gift to Redeem" subtitle="View and select gifts to redeem at store." size={2} />
      </div>
      {
      isLoading? 
        <div> 
          Authenticating Transfer... 
        </div>
      : 
      null  
      }

      { isSuccess ? 
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
          <RedeemToken token={selectedToken?.token} /> 
          : 
          <div> Loading ... </div>
        }
      </div>
      :
      <>

        <div className="grid grid-cols-2  overflow-auto sm:grid-cols-3 md:grid-cols-4 p-4 justify-items-center content-start">

          { claimedTokens ?
          
          claimedTokens.map((token: LoyaltyToken) => 
              token.metadata ? 
              <div key = {`${token.tokenAddress}:${token.tokenId}`} >
                <TokenSmall token = {token} disabled = {false} onClick={() => handleTokenSelect(token)}  /> 
              </div>
              : null 
            )
          : 
          <div className="col-span-2 sm:col-span-3 md:col-span-4 m-6"> 
            <NoteText message=" Claimed gifts will appear here."/>
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

