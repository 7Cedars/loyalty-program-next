"use client";

import { useAccount } from 'wagmi'
import { LoyaltyCard, LoyaltyProgram } from "@/types";
import { TitleText } from "../../ui/StandardisedFonts";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUrlProgramAddress } from '../../hooks/useUrl';
import { usePublicClient } from 'wagmi';
import { loyaltyProgramAbi } from '@/context/abi';
import { Log } from 'viem';
import { parseContractLogs, parseUri, parseMetadata, parseEthAddress, parseTransferSingleLogs } from '../../utils/parsers';
import { useDispatch } from 'react-redux';

// 0x8464135c8F25Da09e49BC8782676a84730C318bC

export default function ChooseLoyaltyCard()  {
  const { address } = useAccount() 
  const publicClient = usePublicClient(); 
  const dispatch = useDispatch() 
  const { progAddress, putProgAddressInUrl } = useUrlProgramAddress()
  const [ loyaltyProgram, setLoyaltyProgram ] = useState<LoyaltyProgram>() 
  const [ loyaltyCards, setLoyaltyCards ] = useState<LoyaltyCard[]>() 

  console.log("address: ", address)

  if (progAddress) {
    setLoyaltyProgram({programAddress: parseEthAddress(progAddress)})
  }

  const getLoyaltyProgramUri = async () => {
    console.log("getLoyaltyProgramsUris called")

    if (loyaltyProgram) {

      try { 

        const uri: unknown = await publicClient.readContract({
          address: parseEthAddress(progAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'uri',
          args: [0]
        })

        console.log("URI: ", uri)

        setLoyaltyProgram({... loyaltyProgram, uri: parseUri(uri)})
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getLoyaltyProgramMetaData = async () => {
    console.log("getLoyaltyProgramMetaData called")

    if (loyaltyProgram) {
      try {
          const fetchedMetadata: unknown = await(
            await fetch(parseUri(loyaltyProgram?.uri))
            ).json()

            console.log("getLoyaltyProgramMetaData: fetchedMetadata: ", parseMetadata(fetchedMetadata))
            
            setLoyaltyProgram({...loyaltyProgram, metadata: parseMetadata(fetchedMetadata)})

        } catch (error) {
          console.log(error)
      }
    }
  }

  console.log("loyaltyProgram : ", loyaltyProgram)

  const getLoyaltyCardIds = async () => {
    console.log("getLoyaltyCardIds called, address: ", address)

    const transferSingleData: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi,
      address: parseEthAddress(progAddress), 
      eventName: 'TransferSingle',
      args: {to: address}, 
      fromBlock: 1n,
      toBlock: 16330050n
    });
    const transferredTokens = parseTransferSingleLogs(transferSingleData)
    const loyaltyCardData = transferredTokens.filter(token => token.ids[0] != 0n)
    console.log("getLoyaltyProgramAddresses loyaltyCardIds: ", loyaltyCardData)

    if (loyaltyCardData && progAddress) { 
      const data: LoyaltyCard[] = loyaltyCardData.map(item => { return ({
        cardId: item.ids[0], 
        loyaltyProgramAddress: parseEthAddress(progAddress) 
      })})
      setLoyaltyCards(data)
    } 
    console.log("loyaltyCards: ", loyaltyCards)
  }



  // useEffect(() => {

  //   if (!loyaltyPrograms) { getLoyaltyProgramAddresses() } // check when address has no deployed programs what happens..  
  //   if (
  //     loyaltyPrograms && 
  //     loyaltyPrograms.findIndex(loyaltyProgram => loyaltyProgram.uri) === -1 
  //     ) { getLoyaltyProgramsUris() } 
  //   if (
  //     loyaltyPrograms && 
  //     loyaltyPrograms.findIndex(loyaltyProgram => loyaltyProgram.metadata) === -1 
  //     ) { getLoyaltyProgramsMetaData() } 

  // }, [ , loyaltyPrograms])

  useEffect(() => {
    
    if (address && progAddress) { 
      getLoyaltyCardIds()
      getLoyaltyProgramUri() 
      getLoyaltyProgramMetaData()
    } // check when address has no deployed programs what happens..  
  }, [, address])

  // const handleProgramSelection = (loyaltyProgram: LoyaltyProgram) => {
  //   putProgAddressInUrl(loyaltyProgram.tokenAddress)
  //   dispatch(selectLoyaltyProgram(loyaltyProgram))
  // }

  // Choosing program. -- This is what I have to get working 100% 
  return (
    <div> 
      <TitleText title = "Choose Loyalty Card" subtitle="Choose Card or request a new one." size={1} /> 
      <div className="grid grid-rows-1 grid-flow-col h-full overflow-x-scroll overscroll-auto mb-12"> 
        {/* (The following div is an empty div for ui purposes)   */ }
        <div className="w-[16vw] h-96 ms-4 opacity-0 border-2 border-green-500" /> 
        {/* { loyaltyPrograms ? 
          loyaltyPrograms.map(program => {

            return (
              <button 
                key={program.tokenAddress}
                onClick = {() => handleProgramSelection(program)}
                  className="me-20 mt-12 w-72 h-128"> 
                      <Image
                        className="rounded-lg"
                        width={288}
                        height={420}
                        style = {{ objectFit: "cover" }} 
                        src={program.metadata? program.metadata.imageUri : `/vercel.svg`}
                        alt="DAO space icon"
                      />
              </button>
            )
          })
          : 
          null
        } */}

        {/* TODO: insert button here: 'deploy new program'  */}

      </div>
    </div>
  
    ) 
} 