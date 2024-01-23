"use client"; 
import { LoyaltyToken } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useContractWrite, useContractEvent, useWaitForTransaction, Context, useAccount, useSignMessage, useContractRead, usePublicClient, useSignTypedData } from "wagmi";
import { loyaltyProgramAbi, loyaltyGiftAbi, ERC6551AccountAbi } from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseBigInt, parseEthAddress, parseHash, parseNumber } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { foundry } from "viem/chains";
import { useEffect, useState, useRef } from "react";
import { NumLine } from "@/app/ui/NumLine";
import { useAppSelector } from "@/redux/hooks";
import { encodeAbiParameters, encodePacked, Hex, encodeFunctionData, keccak256 } from "viem";
import { selectLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import QRCode from "react-qr-code";
import { TitleText } from "@/app/ui/StandardisedFonts";


type SelectedTokenProps = {
  token: LoyaltyToken
  loyaltyPoints: number | undefined
  disabled: boolean
}

export default function TokenBig( {token, loyaltyPoints, disabled}: SelectedTokenProps ) {
  const dimensions = useScreenDimensions();
  const { progAddress } =  useUrlProgramAddress();
  const [ hashTransaction, setHashTransaction] = useState<any>()
  const publicClient = usePublicClient()
  const [ nonceData, setNonceData ] = useState<BigInt>()
  const [ isDisabled, setIsDisabled ] = useState<boolean>(disabled) 
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const { selectedLoyaltyProgram } = useAppSelector(state => state.selectedLoyaltyProgram )
  const [ selectedGift, setSelectedGift ] = useState<LoyaltyToken>() 
  const dispatch = useDispatch() 
  const {address} = useAccount()

  console.log("selectedLoyaltyCard?.cardAddress: ", selectedLoyaltyCard?.cardAddress)
  console.log("parseEthAddress(progAddress): ", parseEthAddress(progAddress))
  console.log("nonceData: ", nonceData)

  useEffect(() => {

    const getNonceLoyaltyCard = async () => {
      try {
        const rawNonceData: unknown = await publicClient.readContract({ 
          address: parseEthAddress(progAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'getNonceLoyaltyCard',
          args: [selectedLoyaltyCard?.cardAddress]
        })
        console.log("rawNonceData: ", rawNonceData)
        const nonceData = parseBigInt(rawNonceData); 
        setNonceData(nonceData)
        } catch (error) {
          console.log(error)
        }
      }

    if(!nonceData) { getNonceLoyaltyCard() } 

  }, [nonceData] ) 

  /// begin setup for encoding typed data /// 
  const domain = {
    name: 'Loyalty Program',
    version: '1',
    chainId: 31337,
    verifyingContract: parseEthAddress(progAddress)
  } as const
  
  // The named list of all type definitions
  const types = {
    RequestGift: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'gift', type: 'string' },
      { name: 'cost', type: 'string' },
      { name: 'nonce', type: 'uint256' },
    ],
  } as const
  
  // // The message that will be hashed and signed
  const message = {
    from: parseEthAddress(selectedLoyaltyCard?.cardAddress),
    to:  parseEthAddress(progAddress),
    gift: `${token?.metadata?.name}`,
    cost: `${token?.metadata?.attributes[1].value} points`,
    nonce: nonceData ? parseBigInt(nonceData) : 0n,
  } as const

  const { data: signature, isError, isLoading, isSuccess, signTypedData } =
  useSignTypedData({
    domain,
    message,
    primaryType: 'RequestGift',
    types,
  })

  useEffect(() => { 
    if (isLoading) {
      dispatch(notification({
        id: "claimLoyaltyToken",
        message: `Waiting for authentication..`, 
        colour: "yellow",
        isVisible: true
      }))
    }
    if (isSuccess) {
      setIsDisabled(!isDisabled)

      dispatch(notification({
        id: "claimLoyaltyToken",
        message: `Qrcode succesfully authenticated`, 
        colour: "green",
        isVisible: true
      }))
    }
    if (isError) {
      dispatch(notification({
        id: "claimLoyaltyToken",
        message: `Something went wrong. Qrcode not created.`, 
        colour: "red",
        isVisible: true
      }))
    }
  }, [isSuccess, isError, isLoading])

  return (
    <div className="grid grid-cols-1"> 

      <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full justify-items-center "> 
      { token.metadata && !signature ? 
        <>
        <div className="rounded-lg w-max"> 
         
          <Image
              className="rounded-lg"
              width={dimensions.width < 896 ?  Math.min(dimensions.height, dimensions.width) * .35  : 400}
              height={dimensions.width < 896 ?  Math.min(dimensions.height, dimensions.width) * .35 : 400}
              src={token.metadata.imageUri}
              alt="Loyalty Token icon "
            />
        </div>
        
        <div className="grid grid-cols-1 pt-2 content-between w-full h-full">
          <div> 
          <TitleText title={token.metadata.name} subtitle={token.metadata.description} size={1} />

            <div className="text-center text-sm"> 
              {`Cost: ${token.metadata.attributes[1].value} ${token.metadata.attributes[1].trait_type}`}
            </div> 
          </div>
          <div className="text-center text-md"> 
            <div className="text-center text-md"> 
              {`ID: ${token.tokenId} @${token.tokenAddress.slice(0,6)}...${token.tokenAddress.slice(36,42)}`}
            </div>
            <div className="text-center text-md"> 
               {`Remaining gifts: TBI`}
            </div>
            {/* {`${token.availableTokens?.length} remaining tokens`} */}
          </div>
        </div>
        
        <div className="p-3 flex "> 
          <Button appearance = {"greenEmpty"} onClick={() => signTypedData()} >
            Claim Gift
          </Button>
        </div> 
          
        </>
        : 
        token.metadata && signature ?
          <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "" subtitle = "Let vendor scan this Qrcode to receive your gift" size={1} />
            <div className="m-3"> 
              <QRCode 
                value={`type:claimGift;${token.tokenAddress};${token.tokenId};${selectedLoyaltyCard?.cardAddress};${address};${token.metadata.attributes[1].value};${signature}`}
                style={{ height: "400px", width: "100%", objectFit: "cover"  }}
                />
            </div>
          </div>
        : 
        null 
        }
        </div>
    </div>
  );
}


  // NEED TO REQUEST NONCE... 
  // const encodedFunctionCall: Hex = encodeFunctionData({
  //   abi: loyaltyProgramAbi, 
  //   functionName: "getNonceLoyaltyCard"
  // })