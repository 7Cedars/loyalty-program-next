"use client"

// This should become the landing page of my app. See here: https://unbounce.com/landing-page-examples/best-landing-page-examples/
// Doordash example is nice, as is the very first one: Calm. 

/** 
 * The general idea 
 * 2/3 width, pages that follow up one each other, scrolling down. 
 *    on pages 1, 2 and 3 there is a (different) image of the app. Clicking on it brings the user to the vendor home page.  
 *    Background colours should be single colour. Very simple. The only images are of the app itself.  
 * Page 1: Intro (image of app on the right) 
 *    Big: Say hi to Loyal: the app for customer engagement. 
 *    Small: A one-stop, mobile first, solution for dynamic loyalty programs that deploys in under a minute. 
 *    Button: get started. -> goes to page 4 
 * page 2: Functionality 
 *    Big: What is it? (subsequently: HeroIcons + items)
 *    - Be up and running in under a minute: Loyal comes fully developed with loyalty cards, points and diverse set of loyalty gifts.  
 *    - Only pay for what you use: no server costs, no maintenance. Your customer do not face any additional costs. 
 *    - Highly reliable: full uptime, no server downtime, accesible from anywhere, anytime.  
 *    - Complete flexibility of loyalty gifts: gifts can be chosen from wide ranging - and ever growing - library of examples. Bespoke solutions are also available on demand.  
 *    Button: get started. -> goes to page 4 
 * Page 3: Technologies used 
 *    - How was it build? (also using heroicons)
 *    - With blockchain technology: currently deployed on testnet X, Y, Z. 
 *    - Using modern token standards: ERC1155, to create loyaltypoints as fungible tokens, loyalty cards as non-fungible NFTs and loyalty vouchers as semi-fungible tokens. 
 *    - Using Token Based Accounts (ERc-6551) 
 *    - ERC-712 to enable gas cost to be covered by you, the vendor. 
 *    Button: get started. -> goes to page 4 
 * Page 4
 *    - Big: Why not try out one of these examples? 
 *    - Carousel of deployed examples. With deploy onderneath. - when deployed the button changes to: go to app. 
 * Page 5 (only 1/3 height, everything centered)
 *    -  Big: Know what you are doing? -- small: deploy yourself with a valid uri. 
 * Page 6 (bottom navbar)
 *    - some info about project. 
 */ 




import Link from 'next/link'


export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
        <div className='flex flex-col divide-y divide-gray-600  w-full justify-center'> 
          <div className='p-2 text-center text-gray-600 hover:text-gray-900'> 
            <Link href='/customer/home'>Go to customer website </Link>
          </div>
          <div className='p-2 text-center text-gray-600 hover:text-gray-900'>
            <Link href='/vendor/home'>Go to vendor website </Link>
          </div>
        </div>
    </main>
  )
}
