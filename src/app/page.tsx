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
<<<<<<< HEAD
  // const dispatch = useDispatch(); 
=======
>>>>>>> ad3d9c516e9cd87d36b3f104eac4a839203f3c40

  console.log("deployRequest: ", deployRequest)

  const handleDeployRequest = async (data: DeployRequestProps) => {
    console.log("handleDeployRequest CALLED, uri: ", data)
<<<<<<< HEAD
    // !walletClient ? open({view: "Networks"}) : null  
=======
    console.log("walletClient: ", walletClient)
    walletClient ? open({view: "Connect"}) : open({view: "Networks"}) 
    setDeployRequest(data)
  }

  const deployLoyaltyProgram = async () => {

    // const registry: EthAddress = parseEthAddress("0x782abFB5B5412a0F89D3202a2883744f9B21B732") 
    // const implementation: EthAddress = parseEthAddress("0x71C95911E9a5D330f4D621842EC243EE1343292e") 
    const registry: EthAddress = parseEthAddress("0x782abFB5B5412a0F89D3202a2883744f9B21B732") 
    const implementation: EthAddress = parseEthAddress("0x71C95911E9a5D330f4D621842EC243EE1343292e") 

    if (walletClient && deployRequest) {
      // open({view: "Connect"}) 
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
                Get Started
              </Button>
            </a> 
          </div>
          <div className="grid grid-cols-1 text-slate-300 py-6">
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> An minimal viable prodduct demonstration </div>
              <div className="text-slate-400 text-sm"> Showcasing how blackchain technology can be used to create accessible, versatile and global loyalty programs. </div>     
            </div>       
            <div className="m-3"> 
              <div className="font-bold text-slate-300 text-sm"> Building on a generic loyalty card on which points and vouchers are collected... </div>
              <div className="text-slate-400 text-sm"> Using token based accounts, it creates transferrable cards that collect non-transferrable points and vouchers. </div>  
            </div>
            <div className="m-3"> 
              <div className="font-bold text-slate-300 text-sm"> ... and specific plugin contracts to translate points into gifts and vouchers.  </div>
              <div className="text-slate-400 text-sm"> Using the ERC-1155 standard, external contracts - that can be build by anyone - provide specific logics to translate points to gifts or NFT vouchers. </div>  
            </div>
            <div className="m-3"> 
              <div className="font-bold text-slate-300 text-sm"> These gift contracts are immensely flexible </div>
              <div className="text-slate-400 text-sm"> The logic used to redeem points is comepletely open: build a raffle (with random gifts); require presence of a token on card, restrict availability to a particular day - anything and everything is possible. </div>  
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
                Get Started
              </Button>
            </a> 
          </div>
        </div>

        <div className={`h-full grid grid-cols-1 sm:grid-cols-2 content-center w-full max-w-4xl sm:w-4/5 bg-slate-700 shadow-2xl p-8`}>
          <div className="col-span-2 content-center">
          <TitleText title="How was it build?" size = {2} colourMode= {1}/>  
          </div> 
          <Image
              src={"/images/appScreenHome.svg"}
              alt={"Example home screen"}
              style = {{ objectFit: "fill" }} 
              width={400}
              height={600}
              className="w-full self-center"
            />
          <div className="grid grid-cols-1 text-slate-700  py-6 self-center">
            <div className="m-3">
              <div className="font-bold text-slate-300 text-sm"> Blockchain technology</div>
              <div className="text-slate-400 text-sm">  Currently deployed on Sepolia, OP Sepolia and Arbitrum Sepolia. </div>     
            </div>

            <div className="m-3"> 
              <div className="font-bold text-slate-300 text-sm"> Using modern token standards </div>
              <div className="text-slate-400 text-sm"> Building on ERC1155, loyalty points are deployed as a fungible coin, loyalty cards as non-fungible NFTs and loyalty vouchers as semi-fungible tokens. </div>  
            </div>
            <div className="m-3"> 
              <div className="font-bold text-slate-300 text-sm"> Token Based Accounts (TBAs) </div>
              <div className="text-slate-400 text-sm"> Loyalty Cards are deployed as TBA using the ERC6511 standard and registries. </div>  
            </div>
            <div className="m-3"> 
              <div className="font-bold text-slate-300 text-sm"> Off chain transactions </div>
              <div className="text-slate-400 text-sm"> Using ERC-712 gas cost are covered by the vendor. </div>  
            </div>
            <div className="m-3"> 
              <div className="font-bold text-slate-300 text-sm"> Account Abstraction </div>
              <div className="text-slate-400 text-sm"> Coming soon. </div> 
            </div>
          </div>
          
        </div>

        <div className='h-[80vh] w-full max-w-4xl  sm:w-4/5 bg-slate-300 shadow-2xl p-2 pt-6 flex flex-col content-center'  id="deploy-program">
          <TitleText title="New here?" subtitle="Deploy and try out any of these examples" size = {2} colourMode={0}/>  
          <div className="px-2 sm:px-20"> 

          <div className="relative my-6 mx-auto">
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

                      { item.index==selectIndex  ? 

                        isIdle ? 
                          <div className='h-fit w-48 flex transition ease-in-out delay-150"'>
                            <Button appearance='grayEmpty' onClick={() => handleDeployRequest({
                                uri: item.uri,  
                                name: item.title,  
                                version: "1"
                              })}  
                              disabled={ false }> 
                              Deploy
                            </Button>
                          </div>
                        :
                        isError ? 
                          <div className='h-fit w-48 flex transition ease-in-out delay-150"'>
                            <Button appearance='redFilled'   disabled={ true }> 
                              Error 
                            </Button>
                          </div>
                        :
                        isLoading ?
                          <div className='h-fit w-48 flex transition ease-in-out delay-150"'>
                            <Button appearance='grayEmpty'  disabled={ true }> 
                              Loading...  
                            </Button>
                          </div>
                        :
                        isSuccess ? 
                          <a href="/vendor/home" className='h-fit w-48 h-16 m-2 flex content-center '>
                            <button className='transition "rounded m-1 grow text-md py-2 px-4 border-2 border-green-400 text-green-400 text-center bg-white/50 hover:border-green-700 hover:text-green-700' disabled={ false }> 
                              Visit
                            </button>
                          </a>
                        :
                        <div className='h-fit w-48 flex opacity-0 transition ease-in-out duration-700"'>
                          <Button appearance='grayEmpty'  disabled={ true }> 
                            Invisible  
                          </Button>
                        </div>
                        : 
                        <div className='h-fit w-48 flex opacity-0 transition ease-in-out duration-700"'>
                          <Button appearance='grayEmpty'  disabled={ true }> 
                            Invisible 
                          </Button>
                        </div>
                      }
                      </>
                </div>        
              )
            }
          </div>

          <div className='text-center m-3 text-slate-700'>

            {selectIndex && loyaltyProgramsData ? 
              loyaltyProgramsData.items[selectIndex - 1].description
              : 
              null
            }

          </div> 
          </div>
          </div>
        </div>
        

        {/* <div className={`h-[40vh] grid grid-cols-1 content-center w-full max-w-4xl sm:w-4/5 bg-slate-700 shadow-2x` }>
          <div className="">
            <TitleText title="Know what you're doing?" subtitle="Using a valid uri, deploy your loyalty program here" size = {2} colourMode= {1}/>  
          </div> 
          <form className="flex justify-center h-10 m-6">
            <input type="text" name="uri" id="uri" className="w-4/5 rounded-lg focus:border-slate-300 " />
          </form> 
        </div> */}

        <div className='h-[40vh] w-full sm:w-4/5 bg-slate-700 shadow-2xl rounded-b-lg text-slate-200 text-center'>
          Here a bit of background about me and the project. Work in Progress. 
        </div>
    </main>
  )
}

// Acknowledgments
// This should become the landing page of my app. See here: https://unbounce.com/landing-page-examples/best-landing-page-examples/
// Doordash example is nice, as is the very first one: Calm. 
// NB: for viem function to deploy contract, see :https://viem.sh/docs/contract/deployContract 
// See example here: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_deploying-contracts?file=index.tsx