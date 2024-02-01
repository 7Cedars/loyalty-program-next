"use client"

import { QrCodeIcon } from "@heroicons/react/24/outline";
import { useScreenDimensions } from "./hooks/useScreenDimensions"
import { Carousel } from "./ui/Carousel"
import { TitleText } from "./ui/StandardisedFonts";
import Image from "next/image";

// This should become the landing page of my app. See here: https://unbounce.com/landing-page-examples/best-landing-page-examples/
// Doordash example is nice, as is the very first one: Calm. 

export default function Home() {

  const { height, width } = useScreenDimensions(); 

  console.log("height: ", height)



  return (
    <main className="grid grid-cols-1 w-full h-fit overflow-y-auto shadow-2xl bg-slate-100 justify-items-center p-4">
        <div className={`h-[80vh] grid grid-cols-1 xs:grid-cols-2 content-center w-full sm:w-4/5 bg-slate-300 shadow-2xl rounded-t-lg p-8`}>
          <div className="grid grid-cols-1 content-center"> 
            <TitleText title="say hi to Loyal" subtitle=" A one-stop, mobile first, solution for customer loyalty programs. " size = {2}/>  
            {/* Deployed in under a minute, no-server, no subscriptions or other lockins, open and versatile, while keeping vendors full control. */}
          </div>
          <Image
            src={"/img/appScreenHome.svg"}
            alt={"Example home screen"}
            style = {{ objectFit: "fill" }} 
            width={400}
            height={600}
            className="w-full"
          />
        </div>
      
        <div className={`h-[80vh] grid grid-cols-1 xs:grid-cols-2 content-center w-full sm:w-4/5 bg-slate-700 shadow-2xl p-8`}>
          <div className="col-span-2 content-center">
          <TitleText title="What is it?" size = {2} colourMode= {1}/>  
          </div> 
          <Image
            src={"/img/appScreenHome.svg"}
            alt={"Example home screen"}
            style = {{ objectFit: "fill" }} 
            width={400}
            height={600}
            className="w-full"
          />
          <div className="grid grid-cols-1 text-slate-300  py-6">
            <div className="">
              <div className="font-bold text-slate-300 text-sm"> An minimal viable prodduct demonstration </div>
              <div className="text-slate-400 text-sm"> Showcasing how blackchain technology can be used to create accessible, versatile and global loyalty programs. </div>     
            </div>       
            <div> 
              <div className="font-bold text-slate-300 text-sm"> Building on a generic loyalty card on which points and vouchers are collected... </div>
              <div className="text-slate-400 text-sm"> Using token based accounts, it creates transferrable cards that collect non-transferrable points and vouchers. </div>  
            </div>
            <div className=""> 
              <div className="font-bold text-slate-300 text-sm"> ... and specific plugin contracts to translate points into gifts and vouchers.  </div>
              <div className="text-slate-400 text-sm"> Using the ERC-1155 standard, external contracts - that can be build by anyone - provide specific logics to translate points to gifts or NFT vouchers. </div>  
            </div>
            <div> 
              <div className="font-bold text-slate-300 text-sm"> These gift contracts are immensely flexible </div>
              <div className="text-slate-400 text-sm"> The logic used to redeem points is comepletely open: build a raffle (with random gifts); require presence of a token on card, restrict availability to a particular day - anything and everything is possible. </div>  
            </div>
          </div>
        </div>

        <div className={`h-[80vh] grid grid-cols-1 xs:grid-cols-2 w-full h-full sm:w-4/5 bg-slate-300 shadow-2xl p-8`}>
          <div className="col-span-2">
          <TitleText title="Why use it?" size = {2} colourMode= {0}/>  
          </div> 
          <div className="grid grid-cols-1 text-slate-300 py-6 text-right content-between self-center">
            <div className="">
              <div className="font-bold text-slate-700 text-sm"> Be up and running in under a minute </div>
              <div className="text-slate-400 text-sm"> Loyal comes fully developed with loyalty cards, points and diverse set of loyalty gifts. </div>     
            </div>       

            <div> 
              <div className="font-bold text-slate-700 text-sm"> Only pay for what you use </div>
              <div className="text-slate-400 text-sm"> No server, no maintenance. Your customer do not face any costs. </div>  
            </div>
            <div className=""> 
              <div className="font-bold text-slate-700 text-sm"> Highly reliable </div>
              <div className="text-slate-400 text-sm"> 99% uptime, no server downtime, accesible from anywhere, anytime. </div>  
            </div>
            <div> 
              <div className="font-bold text-slate-700 text-sm"> Flexible </div>
              <div className="text-slate-400 text-sm"> Loyalty gifts are build as external plugin contracts that translate points into gifts or vouchers. It creates a flexible and open ecosystem for customer engagement while retaining vendor control. </div>  
            </div>
            <div> 
              <div className="font-bold text-slate-700 text-sm"> Scale globally effortlessly </div>
              <div className="text-slate-400 text-sm"> Connect with similar shops across the globe effortlessly.  </div> 
            </div>
          </div>
          <Image
            src={"/img/appScreenHome.svg"}
            alt={"Example home screen"}
            style = {{ objectFit: "fill" }} 
            width={400}
            height={600}
            className="w-full h-2/3 self-center"
          />
        </div>

        <div className={`h-[80vh] grid grid-cols-1 xs:grid-cols-2 content-center w-full sm:w-4/5 bg-slate-700 shadow-2xl p-8`}>
          <div className="col-span-2 content-center">
          <TitleText title="How was it build?" size = {2} colourMode= {1}/>  
          </div> 
          <Image
              src={"/img/appScreenHome.svg"}
              alt={"Example home screen"}
              style = {{ objectFit: "fill" }} 
              width={400}
              height={600}
              className="w-full content-center"
            />
          <div className="grid grid-cols-1 text-slate-700  py-6 content-center">
            <div className="">
              <div className="font-bold text-slate-300 text-sm"> Blockchain technology</div>
              <div className="text-slate-400 text-sm">  Currently deployed on Sepolia, OP Sepolia and Arbitrum Sepolia. </div>     
            </div>

            <div> 
              <div className="font-bold text-slate-300 text-sm"> Using modern token standards </div>
              <div className="text-slate-400 text-sm"> Building on ERC1155, loyalty points are deployed as a fungible coin, loyalty cards as non-fungible NFTs and loyalty vouchers as semi-fungible tokens. </div>  
            </div>
            <div className=""> 
              <div className="font-bold text-slate-300 text-sm"> Token Based Accounts (TBAs) </div>
              <div className="text-slate-400 text-sm"> Loyalty Cards are deployed as TBA using the ERC6511 standard and registries. </div>  
            </div>
            <div> 
              <div className="font-bold text-slate-300 text-sm"> Off chain transactions </div>
              <div className="text-slate-400 text-sm"> Using ERC-712 gas cost are covered by the vendor. </div>  
            </div>
            <div> 
              <div className="font-bold text-slate-300 text-sm"> Account Abstraction </div>
              <div className="text-slate-400 text-sm"> Coming soon. </div> 
            </div>
          </div>
          
        </div>

        <div className='h-[80vh] w-11/12 sm:w-4/5 bg-slate-300 shadow-2xl p-2 grid grid-cols-1 content-center'>
          <TitleText title="New here?" subtitle="Deploy and try out any of these examples" size = {2} colourMode={0}/>  
          <div className="px-2 sm:px-20"> 
            <Carousel /> 
          </div>
        </div>
        

        <div className={`h-[40vh] grid grid-cols-1 content-center w-full sm:w-4/5 bg-slate-700 shadow-2x`}>
          <div className="">
            <TitleText title="Know what you're doing?" subtitle="Using a valid uri, deploy your loyalty program here" size = {2} colourMode= {1}/>  
          </div> 
          <form className="flex justify-center h-10 m-6">
            <input type="text" name="uri" id="uri" className="w-4/5 rounded-lg focus:border-slate-300 " />
          </form> 
        </div>

        <div className='h-[40vh] w-11/12 sm:w-4/5 bg-slate-300 shadow-2xl rounded-b-lg text-center'>
          Here a bit of background about me and the project. Work in Progress. 
        </div>
    </main>
  )
}
