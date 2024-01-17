import { useAccount } from 'wagmi'
import { LoyaltyProgram } from "@/types";
import { TitleText } from "../../ui/StandardisedFonts";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUrlProgramAddress } from '../../hooks/useUrl';
import { usePublicClient } from 'wagmi';
import { loyaltyProgramAbi } from '@/context/abi';
import { Log } from 'viem';
import { parseContractLogs, parseUri, parseMetadata } from '../../utils/parsers';
import { useDispatch } from 'react-redux';
import { selectLoyaltyProgram } from '@/redux/reducers/loyaltyProgramReducer';

export default function ChooseProgram()  {
  const { address } = useAccount() 
  const publicClient = usePublicClient(); 
  const dispatch = useDispatch() 
  const { putProgAddressInUrl } = useUrlProgramAddress()
  const [ loyaltyPrograms, setLoyaltyPrograms ] = useState<LoyaltyProgram[]>() 

  console.log("loyaltyPrograms: ", loyaltyPrograms)

  const getLoyaltyProgramAddresses = async () => {
    // console.log("getLoyaltyProgramAddresses called")

    const loggedAdresses: Log[] = await publicClient.getContractEvents( { 
      abi: loyaltyProgramAbi, 
        eventName: 'DeployedLoyaltyProgram', 
        args: {owner: address}, 
        fromBlock: 1n,
        toBlock: 16330050n
    });

    console.log("loggedAdresses @choosePrograms: ", loggedAdresses)

    const loyaltyProgramAddresses = parseContractLogs(loggedAdresses)
    setLoyaltyPrograms(loyaltyProgramAddresses)

    console.log("loyaltyProgramAddresses: ", loyaltyProgramAddresses)
  }

  const getLoyaltyProgramsUris = async () => {
    // console.log("getLoyaltyProgramsUris called")

    let loyaltyProgram: LoyaltyProgram
    let loyaltyProgramsUpdated: LoyaltyProgram[] = []

    if (loyaltyPrograms) { 

      try {
        for await (loyaltyProgram of loyaltyPrograms) {

          const uri: unknown = await publicClient.readContract({
            address: loyaltyProgram.programAddress, 
            abi: loyaltyProgramAbi,
            functionName: 'uri',
            args: [0]
          })

          console.log("URI @getLoyaltyProgramsUris: ", uri)

          loyaltyProgramsUpdated.push({...loyaltyProgram, uri: `${parseUri(uri)}`})
        }

        setLoyaltyPrograms(loyaltyProgramsUpdated)

        } catch (error) {
          console.log(error)
      }
    }
  }

  const getLoyaltyProgramsMetaData = async () => {
    // console.log("getLoyaltyProgramsMetaData called")

    let loyaltyProgram: LoyaltyProgram
    let loyaltyProgramsUpdated: LoyaltyProgram[] = []

    if (loyaltyPrograms) { 
      try {
        for await (loyaltyProgram of loyaltyPrograms) {

          const fetchedMetadata: unknown = await(
            await fetch(parseUri(loyaltyProgram.uri))
            ).json()

          loyaltyProgramsUpdated.push({...loyaltyProgram, metadata: parseMetadata(fetchedMetadata), programOwner: address})
        }

        setLoyaltyPrograms(loyaltyProgramsUpdated)

        } catch (error) {
          console.log(error)
      }
    }
  }


  useEffect(() => {

    // check when address has no deployed programs what happens. Answer: It goes into a unforgiving loop... 
    if (!loyaltyPrograms) { getLoyaltyProgramAddresses() } 
    if (
      loyaltyPrograms && 
      loyaltyPrograms.length != 0 &&
      loyaltyPrograms.findIndex(loyaltyProgram => loyaltyProgram.uri) === -1 
      ) { getLoyaltyProgramsUris() } 
    if (
      loyaltyPrograms && 
      loyaltyPrograms.length != 0 &&
      loyaltyPrograms.findIndex(loyaltyProgram => loyaltyProgram.metadata) === -1 
      ) { getLoyaltyProgramsMetaData() } 

  }, [ , loyaltyPrograms])

  useEffect(() => {
    if (loyaltyPrograms) { setLoyaltyPrograms(undefined) } // check when address has no deployed programs what happens..  
  }, [, address])

  const handleProgramSelection = (loyaltyProgram: LoyaltyProgram) => {
    putProgAddressInUrl(loyaltyProgram.programAddress)
    dispatch(selectLoyaltyProgram(loyaltyProgram))
  }

  // Choosing program. -- This is what I have to get working 100% 
  return (
    <div> 
      <TitleText title = "Choose Loyalty Program" subtitle="Choose existing program or deploy a new one." size={1} /> 
      <div className="grid grid-rows-1 grid-flow-col h-full overflow-x-scroll overscroll-auto mb-12"> 
        {/* (The following div is an empty div for ui purposes)   */ }
        <div className="w-[16vw] h-96 ms-4 opacity-0 border-2 border-green-500" /> 
        
        { loyaltyPrograms  ? 
          loyaltyPrograms.map(program => {

            return (
              <button 
                key={program.programAddress}
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
        }

        {/* TODO: insert button here: 'deploy new program'  */}

      </div>
    </div>
  
    ) 
} 