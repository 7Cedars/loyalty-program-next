"use client"

import loyaltyProgramsData from "../../public/exampleLoyaltyPrograms.json"; // not that this is a very basic json file data format - can be used in many other cases as well. 
import { TitleText } from "./ui/StandardisedFonts";
import Image from "next/image";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { loyaltyProgramAbi } from "@/context/abi";
import { loyaltyProgramBytecode } from "@/context/bytecode";
import { useCallback, useEffect, useState } from "react";
import { Hex } from "viem";
import { Button } from "./ui/Button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useWalletClient } from "wagmi";
import { SUPPORTED_CHAINS } from "@/context/constants";

type DeployRequestProps = { 
  uri: string; 
  name: string; 
  version: string; 
}

export default function Home() {
  const {address, status} = useAccount(); 
  const [transactionHash, setTransactionHash] = useState<Hex>(); 
  const { open, close } = useWeb3Modal()
  const { data: walletClient } = useWalletClient();
  const [deployRequest, setDeployRequest] = useState<DeployRequestProps>();
  const [ selectIndex, setSelectedIndex ] = useState<number | undefined>(1);
  const { chain } = useAccount() 
  const [ currentChain, setCurrentChain ] = useState<any>(); // £todo still needs to be properly types.. 

  const handleDeployRequest = async (data: DeployRequestProps) => {
    setDeployRequest(data)
    console.log("data @deploy: ", data)
  }

  useEffect(() => {
    const chainIds = SUPPORTED_CHAINS.map(chain => chain.chainId)

    if (chain && chainIds.includes(chain.id)) {
      const selectChain = SUPPORTED_CHAINS.find(supportedChain => supportedChain.chainId === chain.id)
      setCurrentChain(selectChain)
    }
  }, [chain])

  const deployLoyaltyProgram = useCallback( async () => {

    if (status === "connected" && walletClient && deployRequest) {
      const hash = await walletClient.deployContract({
        abi: loyaltyProgramAbi,
        chain: chain,
        account: address,
        args: [
          deployRequest.uri,
          deployRequest.name,
          deployRequest.version
        ],
        bytecode: loyaltyProgramBytecode,
      })
      setDeployRequest(undefined)
      setTransactionHash(hash)
    }
  },  [address, walletClient, deployRequest, status] )

  const { data, isError, isPending, isSuccess } = useWaitForTransactionReceipt(
    { 
      confirmations: 1,
      hash: transactionHash
    })


  useEffect(() => {
    if (walletClient && deployRequest) deployLoyaltyProgram() 
  }, [walletClient, deployRequest, deployLoyaltyProgram])

  return (
    <main className="grid grid-cols-1 w-full h-fit overflow-y-auto shadow-2xl bg-slate-100 justify-items-center p-4">
      <div className={`h-fit grid grid-cols-1 content-center justify-items-center w-full max-w-4xl md:w-4/5 bg-red-300 shadow-2xl rounded-lg py-2 px-8 m-4`}>
        <div className={`text-center text-red-800 text-lg`}>
          This is a Minimal Viable Product Demonstration
        </div> 
        <div className={`text-center text-red-800 text-sm md:px-12 px-2`}>
          Its UI/UX is imperfect, the app is not optimised & may break at any time. I used this app as an educational project, so please be kind :)     
        </div> 

      </div>

        <div className={`h-[80vh] grid grid-cols-1 sm:grid-cols-2 content-center justify-items-center w-full max-w-4xl md:w-4/5 bg-slate-300 shadow-2xl rounded-t-lg p-8`}>
          <div className="grid grid-cols-1 content-center"> 
            <div className="grid grid-cols-1 pb-2 px-2">
              <div className={`text-center font-bold text-slate-700 text-2xl py-1`}>
                say hi to Loyal
              </div>
              <div className={`text-center text-slate-400 text-lg`}>
                A one-stop, mobile first, solution for customer loyalty programs. 
              </div>
            </div>

            {/* <TitleText title="say hi to Loyal" subtitle="A one-stop, mobile first, solution for customer loyalty programs. " size = {2}/>   */}
            {/* Deployed in under a minute, no-server, no subscriptions or other lockins, open and versatile, while keeping vendors full control. */}
          </div>
          <div className="flex items-center w-2/3 m-2"> 
            <Image
              src={"/images/vendorHomeScreen.svg"}
              alt={"Example home screen"}
              style = {{ objectFit: "fill" }} 
              width={400}
              height={600}
              className="w-full"
            />
          </div>
        </div>
      
        <div className={`min-h-[80vh] h-fit grid grid-cols-1 md:grid-cols-2 content-center w-full max-w-4xl md:w-4/5 bg-slate-700 shadow-2xl p-8`}>
          <div className="grid grid-cols-1 md:col-span-2 self-center">
            <div className="grid grid-cols-1 pb-2 px-2">
              <div className={`text-center font-bold text-slate-300 text-2xl py-1`}>
                What is it?
              </div>
            </div>
            
          {/* <TitleText title="What is it?" size = {2} colourMode= {1}/>   */}
          </div> 
          <div className="flex flex-col m-2 self-center items-center"> 
            <Image
              src={"/images/vendorSelectGifts.svg"}
              alt={"Example home screen"}
              style = {{ objectFit: "fill" }} 
              width={400}
              height={600}
              className="w-2/3 h-2/3 m-2"
            />
            <a href="#deploy-program" className="h-16 flex w-full">
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
              <div className="font-bold text-slate-300 text-sm"> ERC-6551: Token Based Accounts </div>
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
              <div className="font-bold text-slate-300 text-sm"> Deployable at any testnet with a ERC-6551 registry (v.0.3.1). </div>
              {/* FILL OUT TEST NETS HERE  */}
              <div className="text-slate-400 text-sm"> This frontend runs on the Optimism Sepolia testnet. </div>      
            </div> 
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> Want to know more? </div>
              <div className="text-slate-400 text-sm"> See  <a href="https://github.com/7Cedars/loyalty-program-contracts" ><strong> this github repo </strong></a>  for its solidity backend.  </div>     
            </div>
        </div>
        </div>
        <div className={`h-fit grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl h-full md:w-4/5 bg-slate-300 shadow-2xl p-8`}>
          <div className="cols-span-1 md:col-span-2">
            <div className="grid grid-cols-1 pb-2 px-2">
              <div className={`text-center font-bold text-slate-700 text-2xl py-1`}>
                Why use it?
              </div>
            </div>

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
          <div className="flex flex-col mx-6 my-4 self-center w-2/3"> 
            <Image
              src={"/images/vendorTransactionScreen.svg"}
              alt={"Example home screen"}
              style = {{ objectFit: "fill" }} 
              width={400}
              height={600}
              className="w-full"
            />
            <a href="#deploy-program" className="h-16 flex w-full">
              <Button appearance="grayEmptyDark">
                Try it out
              </Button>
            </a> 
          </div>
        </div>

        <div className='h-fit w-full max-w-4xl  md:w-4/5 bg-slate-700 shadow-2xl p-2 pt-6 pb-8 flex flex-col content-center'  id="deploy-program">
          <TitleText title="Want to try it out?" subtitle="Deploy any of these examples in less than two minutes" size = {2} colourMode={1}/>  
          
            <div className="grid grid-rows-1 grid-flow-col h-full overflow-x-auto overscroll-auto mb-12 justify-items-center content-center"> 
          
            {loyaltyProgramsData.items.map((item) => 
              <button 
                key={item.index}
                onClick={() => setSelectedIndex(item.index)}
                disabled={ item.index==selectIndex }
                className="ms-6 mt-6 w-60 h-fit justify-self-center rounded-lg grid grid-cols-1 enabled:opacity-25 transition-all ease-in-out delay-250"> 
                  <Image
                      src={item.imageUrl || ''}
                      alt={item.title}
                      style = {{ objectFit: "cover" }} 
                      width={400}
                      height={600}
                      className="w-48 h-68 self-center" 
                    />
              </button>
           
              )}
              </div> 

              <div className='text-center text-slate-300 mb-4 w-full flex justify-center '>
                <div className="w-2/3">
                {selectIndex && loyaltyProgramsData ? 
                  loyaltyProgramsData.items[selectIndex - 1].description
                  : 
                  null
                }
                </div>
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
                  walletClient && selectIndex && !transactionHash ? 
                    <Button 
                        appearance='grayEmptyLight' 
                        onClick={() => handleDeployRequest({
                          uri: loyaltyProgramsData.items[selectIndex -1].uri,  
                          name: loyaltyProgramsData.items[selectIndex -1].title,  
                          version: "alpha.2"
                        })}  
                      > 
                      Deploy
                    </Button>
                  :
                  walletClient && selectIndex && isPending ? 
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
                    <a href="/vendor/home">
                       <Button appearance='greenEmpty'  disabled={ false }> 
                          Visit Loyalty Program
                      </Button>
                    </a>
                  : 
                  null 
                }
                </div>
              </div>
          </div>

          <div className={`h-fit grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl h-full md:w-4/5 bg-slate-300 shadow-2xl p-8 rounded-b-lg justify-items-center`}>
              <div className="grid grid-cols-1 pb-2 px-20 cols-span-1 md:col-span-2">
                <div className={`text-center font-bold text-slate-700 text-2xl py-1`}>
                  Already have a program deployed?
                </div>
            </div> 

            <a href="/vendor/home" className="h-16 w-60 flex justify-center cols-span-1 md:col-span-2 my-8 ">
              <Button appearance="grayEmptyDark" onClick={() => {}}>
                Visit vendor website
              </Button>
            </a> 
          </div>

    </main>
  )
}

// Acknowledgments £ack
// This should become the landing page of my app. See here: https://unbounce.com/landing-page-examples/best-landing-page-examples/
// Doordash example is nice, as is the very first one: Calm. 
// NB: for viem function to deploy contract, see :https://viem.sh/docs/contract/deployContract 
// See example here: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_deploying-contracts?file=index.tsx