"use client"; 
import { LoyaltyGift } from "@/types";
import Image from "next/image";
import { useScreenDimensions } from "@/app/hooks/useScreenDimensions";
import { Button } from "@/app/ui/Button";
import { useAccount,  useNetwork,  usePublicClient, useSignTypedData, useWalletClient } from "wagmi";
import { loyaltyProgramAbi} from "@/context/abi";
import { useUrlProgramAddress } from "@/app/hooks/useUrl";
import { parseBigInt, parseEthAddress } from "@/app/utils/parsers";
import { useDispatch } from "react-redux";
import { notification } from "@/redux/reducers/notificationReducer";
import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import QRCode from "react-qr-code";
import { TitleText } from "@/app/ui/StandardisedFonts";
import { useLatestCustomerTransaction } from "@/app/hooks/useLatestTransaction";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";


type SelectedTokenProps = {
  token: LoyaltyGift
  disabled: boolean
}

export function TokenBig( {token, disabled}: SelectedTokenProps ) {
  const dimensions = useScreenDimensions();
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const publicClient = usePublicClient()
  const [ nonceData, setNonceData ] = useState<BigInt>()
  const [ isDisabled, setIsDisabled ] = useState<boolean>(disabled) 
  const { selectedLoyaltyCard } = useAppSelector(state => state.selectedLoyaltyCard )
  const polling = useRef<boolean>(false) 
  const {  pointsSent } = useLatestCustomerTransaction(polling.current) 
  const dispatch = useDispatch() 
  const {address } = useAccount()
  const {chain} = useNetwork() 
  const {open} = useWeb3Modal()
  const { data: walletClient, status } = useWalletClient();
  const { open: isOpen, selectedNetworkId } = useWeb3ModalState()

  console.log("selectedLoyaltyCard?.cardAddress: ", selectedLoyaltyCard?.cardAddress)
  console.log("parseEthAddress(selectedLoyaltyProgram?.programAddress): ", parseEthAddress(selectedLoyaltyProgram?.programAddress))
  console.log("nonceData: ", nonceData)
  console.log("chain: ",chain )

  useEffect(() => {
    const getNonceLoyaltyCard = async () => {
      try {
        const rawNonceData: unknown = await publicClient.readContract({ 
          address: parseEthAddress(selectedLoyaltyProgram?.programAddress), 
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
    name: "Loyalty Program",
    version: "1",
    chainId: chain?.id,
    verifyingContract: parseEthAddress(selectedLoyaltyProgram?.programAddress)
  } as const

  console.log("domain: ", domain)
  
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
    to:  parseEthAddress(selectedLoyaltyProgram?.programAddress),
    gift: `${token?.metadata?.name}`,
    cost: `${token?.metadata?.attributes[1].value} points`,
    nonce: nonceData ? parseBigInt(nonceData) : 0n,
  } as const

  console.log("message: ", message)

  const { data: signature, isError, isLoading, isSuccess, reset: resetSignature, signTypedData } = useSignTypedData({
    domain,
    message,
    primaryType: 'RequestGift',
    types,
  })
  
  const handleSigning = () => {
    signTypedData()
  }

  useEffect(() => { 
    if (isLoading) {
      dispatch(notification({
        id: "qrCodeAuthentication",
        message: `Please sign your request in your blockchain wallet app.`, 
        colour: "yellow",
        isVisible: true
      }))
    }
    if (isSuccess) {
      setIsDisabled(!isDisabled)
      polling.current = true 

      dispatch(notification({
        id: "qrCodeAuthentication",
        message: `Qrcode succesfully authenticated`, 
        colour: "green",
        isVisible: true
      }))
    }
    if (isError) {
      dispatch(notification({
        id: "qrCodeAuthentication",
        message: `Something went wrong. Qrcode not created.`, 
        colour: "red",
        isVisible: true
      }))
    }
  }, [isSuccess, isError, isLoading])

  useEffect(() => {
    if (pointsSent) {
      resetSignature() 
      polling.current = false 
      dispatch(notification({
        id: "qrCodeAuthentication",
        message: `Your loyalty points have been succesfully received.`, 
        colour: "green",
        isVisible: true
      }))
    }
  }, [pointsSent])

  return (
    <div className="grid grid-cols-1"> 
      { token.metadata && !signature ? 
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 h-fit w-full justify-items-center "> 
          <div className="rounded-lg w-max"> 
          
            <Image
                className="rounded-lg"
                width={dimensions.width < 896 ?  Math.min(dimensions.height, dimensions.width) * .35  : 400}
                height={dimensions.width < 896 ?  Math.min(dimensions.height, dimensions.width) * .35 : 400}
                src={token.metadata.imageUri}
                alt="Loyalty Token icon "
              />
          </div>
          
          <div className="grid grid-cols-1 pt-2 content-between w-full h-fit">
            <div> 
            <TitleText title={token.metadata.name} subtitle={token.metadata.description} size={1} />

              <div className="text-center text-sm"> 
                {`Cost: ${token.metadata.attributes[1].value} ${token.metadata.attributes[1].trait_type}`}
              </div> 
            </div>
            {pointsSent ? 
              <p className="text-center text-xl font-bold p-8">
                {token.metadata?.attributes[4].value}
              </p>
            :
            null
            }
            <div className="text-center text-md"> 
              <div className="text-center text-md"> 
                {`ID: ${token.giftId} @${token.giftAddress.slice(0,6)}...${token.giftAddress.slice(36,42)}`}
              </div>
              {token.tokenised == 1n ? 
                <div className="text-center text-md"> 
                  {`Remaining vouchers: ${token.availableTokens}`}
                </div>
                :
                null
              }
            </div>
          </div>
        </div>
        <div className="p-3 flex w-full"> 
          {/* { pointsSent ? */}

            { token.tokenised == 1n ? 

              <Button appearance = {"greenEmpty"} onClick={() => signTypedData()}  >
                Claim Voucher
              </Button>
              :
              <Button appearance = {"greenEmpty"} onClick={() => signTypedData()} >
                Claim Gift
              </Button>
           
          }
          </div>
        </>
        : null
        }
        
        { token.metadata && signature ?
          <div className="col-span-1 xs:col-span-2 sm:col-span-3 md:col-span-4"> 
            <TitleText title = "" subtitle = "Let vendor scan this Qrcode to receive your gift" size={1} />
            <div className="flex m-3 justify-center"> 
              <QRCode 
                value={`type:claimGift;${token.giftAddress};${token.giftId};${selectedLoyaltyCard?.cardId};${address};${token.metadata.attributes[1].value};${signature}`}
                style={{ 
                  height: "350px", 
                  width: "350px", 
                  objectFit: "cover", 
                  background: 'white', 
                  padding: '16px', 
                }}
                bgColor="#ffffff" // "#0f172a" 1e293b
                fgColor="#000000" // "#e2e8f0"
                level='L'
                className="rounded-lg"
                />
            </div>
          </div>
        : 
        null 
        }
      <div className="h-20" />
    </div>
  );
}




  // NEED TO REQUEST NONCE... 
  // const encodedFunctionCall: Hex = encodeFunctionData({
  //   abi: loyaltyProgramAbi, 
  //   functionName: "getNonceLoyaltyCard"
  // })