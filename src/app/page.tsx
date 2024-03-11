"use client"

import loyaltyProgramsData from "../../public/exampleLoyaltyPrograms.json"; // not that this is a very basic json file data format - can be used in many other cases as well. 
import { TitleText } from "./ui/StandardisedFonts";
import Image from "next/image";
import { useAccount, useWaitForTransaction } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { loyaltyProgramBytecode } from "@/context/bytecode";
import { useEffect, useState } from "react";
import { Hex } from "viem";
import { EthAddress } from "@/types";
import { Button } from "./ui/Button";
// import 'viem/window'
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useWalletClient } from "wagmi";
import { parseEthAddress } from "./utils/parsers";
import { useDispatch } from "react-redux";
import NavbarBottom from "./vendor/components/NavbarBottom";
import Link from "next/link";

type DeployRequestProps = { 
  uri: string; 
  name: string; 
  version: string; 
}

export default function Home() {
  const {address} = useAccount(); 
  const [transactionHash, setTransactionHash] = useState<Hex>(); 
  const { open, close } = useWeb3Modal()
  const { data: walletClient, status } = useWalletClient();
  const [deployRequest, setDeployRequest] = useState<DeployRequestProps>();
  const [ selectIndex, setSelectedIndex ] = useState<number | undefined>(1);

  console.log("deployRequest: ", deployRequest)

  const handleDeployRequest = async (data: DeployRequestProps) => {
    console.log("handleDeployRequest CALLED, uri: ", data)
    console.log("walletClient: ", walletClient)
    // walletClient ? open({view: "Connect"}) : open({view: "Networks"}) 
    setDeployRequest(data)
  }

  const deployLoyaltyProgram = async () => {

    // const registry: EthAddress = parseEthAddress("0x782abFB5B5412a0F89D3202a2883744f9B21B732") 
    // const implementation: EthAddress = parseEthAddress("0x71C95911E9a5D330f4D621842EC243EE1343292e") 
    const registry: EthAddress = parseEthAddress("0x782abFB5B5412a0F89D3202a2883744f9B21B732") 
    const implementation: EthAddress = parseEthAddress("0x71C95911E9a5D330f4D621842EC243EE1343292e") 

    if (walletClient && deployRequest) {
      const hash = await walletClient.deployContract({
        abi: loyaltyProgramAbi,
        account: address,
        args: [
          deployRequest.uri,
          deployRequest.name,
          deployRequest.version,
          registry, // registry 
          implementation // deployArgs.erc65511Implementation
        ],
        bytecode: loyaltyProgramBytecode,
      })
      setDeployRequest(undefined)
      setTransactionHash(hash)
    }
  }

  const { data, isError, isLoading, isSuccess, isIdle } = useWaitForTransaction(
    { 
      confirmations: 1,
      hash: transactionHash
    })


  useEffect(() => {
    if (walletClient && deployRequest) deployLoyaltyProgram() 
  }, [walletClient, deployRequest])


  return (
    <main className="grid grid-cols-1 w-full h-fit overflow-y-auto shadow-2xl bg-slate-100 justify-items-center p-4">
        <div className={`h-[80vh] grid grid-cols-1 sm:grid-cols-2 content-center w-full max-w-4xl sm:w-4/5 bg-slate-300 shadow-2xl rounded-t-lg p-8`}>
          <div className="grid grid-cols-1 content-center"> 
            <TitleText title="say hi to Loyal" subtitle="A one-stop, mobile first, solution for customer loyalty programs. " size = {2}/>  
            {/* Deployed in under a minute, no-server, no subscriptions or other lockins, open and versatile, while keeping vendors full control. */}
          </div>
          <Image
            src={"/images/vendorHomeScreen.svg"}
            alt={"Example home screen"}
            style = {{ objectFit: "fill" }} 
            width={400}
            height={600}
            className="w-full"
          />
        </div>
      
        <div className={`min-h-[80vh] h-fit grid grid-cols-1 sm:grid-cols-2 content-center w-full max-w-4xl sm:w-4/5 bg-slate-700 shadow-2xl p-8`}>
          <div className="grid grid-cols-1 sm:col-span-2 self-center">
          <TitleText title="What is it?" size = {2} colourMode= {1}/>  
          </div> 
          <div className="flex flex-col m-2 self-center"> 
            <Image
              src={"/images/customerCardScreen.svg"}
              alt={"Example home screen"}
              style = {{ objectFit: "fill" }} 
              width={400}
              height={600}
              className="w-full h-2/3"
            />
            <a href="#deploy-program" className="h-16 flex mx-3">
              <Button appearance="grayEmptyLight" onClick={() => {}}>
                Try it out
              </Button>
            </a> 
          </div>
          <div className="grid grid-cols-1 content-center text-slate-300 py-6">
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> A blockchain demonstration </div>
              <div className="text-slate-400 text-sm"> 
              Showcasing how modern contract standards can be used to create an accessible, modular and scalable protocol for loyalty programs. 
              </div>     
            </div> 
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> ERC-1155: fungibility-agnostic </div>
              <div className="text-slate-400 text-sm"> The protocol deploys loyalty points as fungible, loyalty cards as non-fungible and loyalty vouchers as semi-fungible assets. </div>     
            </div> 
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> ERC-6511: Token Based Accounts </div>
              <div className="text-slate-400 text-sm">Loyalty Cards are deployed as TBAs using the ERC6511 standard and registries.  </div>     
            </div> 
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> ERC-712: Typed structured data hashing </div>
              <div className="text-slate-400 text-sm">  Customers exchange points through signed messages, with vendor covering all gas costs. </div>     
            </div> 
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> ERC-4337: Account Abstraction. </div>
              <div className="text-slate-400 text-sm"> Coming soon. </div>     
            </div> 
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> Deployed at several testnets </div>
              {/* FILL OUT TEST NETS HERE  */}
              <div className="text-slate-400 text-sm"> Sepolia, OP Sepolia, ... </div>      
            </div> 
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> Want to know more? </div>
              <div className="text-slate-400 text-sm"> See  <a href="https://github.com/7Cedars/loyalty-program-contracts" ><strong> this github repo </strong></a>  for its solidity backend.  </div>     
            </div>
        </div>
        </div>
        <div className={`h-fit grid grid-cols-1 sm:grid-cols-2 w-full max-w-4xl h-full sm:w-4/5 bg-slate-300 shadow-2xl p-8`}>
          <div className="cols-span-1 sm:col-span-2">
          <TitleText title="Why use it?" size = {2} colourMode= {0}/>  
          </div> 
          <div className="flex flex-col text-slate-300 py-6 text-right">
            <div className="m-3">
              <div className="font-bold text-slate-700 text-sm"> Be up and running in under a minute </div>
              <div className="text-slate-400 text-sm"> Loyal comes fully developed with loyalty cards, points and diverse set of loyalty gifts. </div>     
            </div>       

            <div className="m-3"> 
              <div className="font-bold text-slate-700 text-sm"> Only pay for what you use </div>
              <div className="text-slate-400 text-sm"> No server, no maintenance. Your customer do not face any costs. </div>  
            </div>
            <div className="m-3"> 
              <div className="font-bold text-slate-700 text-sm"> Highly reliable </div>
              <div className="text-slate-400 text-sm"> 99% uptime, no server downtime, accesible from anywhere, anytime. </div>  
            </div>
            <div className="m-3"> 
              <div className="font-bold text-slate-700 text-sm"> Flexible </div>
              <div className="text-slate-400 text-sm"> Loyalty gifts are build as external plugin contracts that translate points into gifts or vouchers. It creates a flexible and open ecosystem for customer engagement while retaining vendor control. </div>  
            </div>
            <div className="m-3"> 
              <div className="font-bold text-slate-700 text-sm"> Scale globally effortlessly </div>
              <div className="text-slate-400 text-sm"> Connect with similar shops across the globe effortlessly.  </div> 
            </div>
          </div>
          <div className="flex flex-col m-2 self-center"> 
            <Image
              src={"/images/vendorTransactionScreen.svg"}
              alt={"Example home screen"}
              style = {{ objectFit: "fill" }} 
              width={400}
              height={600}
              className="w-full h-2/3"
            />
            <a href="#deploy-program" className="h-16 flex mx-3">
              <Button appearance="grayEmpty" onClick={() => {}}>
                Try it out
              </Button>
            </a> 
          </div>
        </div>

        <div className='min-h-[80vh] h-fit w-full max-w-4xl  sm:w-4/5 bg-slate-700 shadow-2xl p-2 pt-6 flex flex-col content-center rounded-b-lg '  id="deploy-program">
          <TitleText title="Want to try it out?" subtitle="Deploy any of these examples in less than two minutes" size = {2} colourMode={1}/>  
          <div className="px-2 sm:px-20"> 

          <div className="relative mt-6 mx-auto">
            <div className="flex flex-row justify-between overflow-x-auto overflow-hidden scroll-px-1 snap-normal w-full h-full self-center">
          
            {loyaltyProgramsData.items.map((item) => 
            
                <div
                  key={item.index}
                  className="carousel-item h-96 w-52 text-center items-center snap-start ml-4 flex flex-col self-center">
                    <>
                      <button 
                        className="w-11/12 z-0 max-h-80 max-w-48 self-center enabled:opacity-50 enabled:w-5/6 transition-all ease-in-out delay-250"
                        onClick={() => setSelectedIndex(item.index)}
                        disabled={ item.index==selectIndex }
                      >
                        <Image
                          src={item.imageUrl || ''}
                          alt={item.title}
                          style = {{ objectFit: "cover" }} 
                          width={400}
                          height={600}
                          className="w-48 h-68 self-center" 
                        />
                      </button>
                    </>
                    </div>
              )}
              </div> 

              <div className='text-center text-slate-300 h-32'>
                {selectIndex && loyaltyProgramsData ? 
                  loyaltyProgramsData.items[selectIndex - 1].description
                  : 
                  null
                }
              </div> 

              <div className='h-fit flex justify-center transition transition-all ease-in-out delay-150'>
                <div className=" flex justify-center w-2/3 "> 
                {
                  !walletClient ? 
                    <Button 
                        appearance='grayEmptyLight' 
                        onClick={() => open({view: "Connect"})}  
                        > 
                      Connect
                    </Button>
                  :
                  walletClient && selectIndex && isIdle ? 
                    <Button 
                        appearance='grayEmptyLight' 
                        onClick={() => handleDeployRequest({
                          uri: loyaltyProgramsData.items[selectIndex].uri,  
                          name: loyaltyProgramsData.items[selectIndex].title,  
                          version: "1"
                        })}  
                      > 
                      Deploy
                    </Button>
                  :
                  walletClient && selectIndex && isLoading ? 
                    <Button appearance='grayEmptyLight'  disabled={ true }> 
                      Loading...  
                    </Button>
                  :
                  walletClient && selectIndex && isError ? 
                    <Button appearance='redFilled'  disabled={ true }> 
                      Error. Sorry, that`s all I know.   
                    </Button>
                  :
                  walletClient && selectIndex && isSuccess ? 
                    <a href="/vendor/home" className='h-fit w-48 h-16 m-2 flex content-center '>
                      <button className='transition "rounded m-1 grow text-md py-2 px-4 border-2 border-green-400 text-green-400 text-center bg-white/50 hover:border-green-700 hover:text-green-700' disabled={ false }> 
                        Visit Loyalty Program
                      </button>
                    </a>
                  : 
                  null 
                }
                </div>
              </div>
          </div>
        </div>
        </div>

    </main>
  )
}

// Acknowledgments £ack
// This should become the landing page of my app. See here: https://unbounce.com/landing-page-examples/best-landing-page-examples/
// Doordash example is nice, as is the very first one: Calm. 
// NB: for viem function to deploy contract, see :https://viem.sh/docs/contract/deployContract 
// See example here: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_deploying-contracts?file=index.tsx