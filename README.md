## Loyalty Program Next 
**Frontend of blockchain based modular platform for loyalty programs**

This repository is meant as initial playground to develop and test front end as I develop to solidity backend. 
Even though repository is public, For now, it is for personal use only. 

## Idea and Design

- Create an open and modular blockchain based framework for loyalty programs. 
- Aimed at small and medium sized shops and companies. 
- eventually deploy on multiple blockchains. 
- Design of solidity frontend is on my Figma. 

## Todo   
VENDOR APP - Implement REFACTORING! 
- [ ] Start designing / thinking through landing page. (/vendor) 
  - [ ] What info to include
  - [ ] Layout / UI. 
  - [ ] Have a easy deploy program in here. 
  - [ ] and easy link to actual app if they alreay have one.  
- [x]  Home page
  - [x]  Refactor selection programs  
  - [x]  If only one program is deployed, should go straigh to it - skip choice page (see customer app for this logic.)
- [ ]  Gift & redeem page / QR reading page 
  - [ ]  Fix Bug that when no valid QR code is read - it craches. Needs to have notification + continue reading. 
  - [x]  At sending new card: 
    - [x]  refactor where needed 
  - [x]  At Claim gift: 
    - [x]  implement claiming gift WITHOUT approval - using signed message instead.
    - [x]  Add statement of what needs to be done by vendor
  - [x]  At redeem token: 
    - [x]  implement redeeming WITHOUT approval - using signed message instead. 
    - [x]  Add statement of what needs to be done by vendor
- [ ]  Selection token page: 
  - [x]  Refactor where needed
  - [ ]  BUG: When tokens cannot be loaded it goes into a loop. Fix! 
  - [ ]  Add address of token + address issuer in description. / later 
- [ ]  Stats page: 
  - [ ]  Refactor where needed
  - [ ]  Check if all possible actions / transactions are actually shown. (I think I am quite far as it is.)
  - [x]  Fix minting coins and cards. Mint Cards -- it was an outof gass error :D 

- [x]  Develop QR reading page
 
 
CUSTOMER APP - Implement REFACTORING! 
- [x]   at home page 
  - [x]   Refactor where needed
  - [x]   choose card screen: add points 
- [x]   at claim tokens -> Claim gifts
  - [x]   refactor where needed according to contracts
  - [x]   implmented signing message - eip 712 
  - [x]   sign implement signing for gift - not voucher. 
  - [x]   Listen for succesfull transfer: Add success notification + have app return to token page + message whant they should receive. 
- [ ]   at redeem token. (or: "Your Loyalty Card"?) - as it gives overview of points + tokens you have on your loyalty card?  
  - [x]   Refactor where needed
  - [x]   implmented signing message - eip 712 
  - [x]   refactor as 'your card'
  - [x]   At points overview here as well. (copy from claim gifts)
  - [ ]   Listen for succesfull redeem: Add success notification + have app return to my card page. (where points - vouchers should have been updated!)
- [ ]   at Transactions 
  - [x]   read received points
  - [ ]   read transferred points
  - [ ]   read claimed tokens 
  - [ ]   read redeemed tokens 
- [ ]   Code clean up (small issue - can leave as is)
  - [x]   Check if naming and links in top and bottom navbar work correctly
  - [ ]   Add points of cards to redux store - no need to keep on readin chain.  

GENERAL 
- [ ]  Test layout / ui / ux 
  - [x]  Has to work from very wide (my full screen) to very narrow (350px) 
  - [ ]  vertical scaling has to also be correct through out (see minting at vendor stats page for correct example)
  - [ ]  fix any other ui/ux issues that pop up. 
- [ ]  Simplify folder structure by moving files from components to top folder oin both vendor and customer app 
  - [x]  create a custom hook: 'useLoyaltyTokens'. params = {LoyaltyTokens, status (loading, isSuccess, isError), refetching}.  -- build as much as possible on code that I have. 
  - [ ]  replace all the parts where I load LoyaltyTokens with this custom hook. 
- [ ]  Fix naming in code 
  - [ ]  Gift, Voucher, Token... Get a clear logic, and implement consistently throughout. 
  - [ ]  ... 
- [ ]  Setup dynamic reading of ABi's - otherwise I will be constantly copy-pasting as I develop the contracts. 
- [ ]  Deploy on Vercel 
- [ ]  Deploy on test net
  - [ ]  First on branched Sepolia network in Foundry.
  - [ ]  Then Sepolia.  
  - [ ]  Then Arbitrum, Optimus, etc. 
  - [ ]  

## Bugs to fix (in order of priority)
- [ ]  

## Improvements to implement (in order of priority)
- [ ]  have two number minted and 

## Additional notes 
  // NB: use of useContractEvent versus waitForTransaction (viem) versus useWaitForTransaction (wagmi) to check confirmaiton of transaction
  // has to be tried out on actual test network. Not anvil. 
  /// 
  // useContractEvent({
  //   address: parseEthAddress(progAddress),
  //   abi: loyaltyProgramAbi,
  //   eventName: 'TransferSingle',
  //   listener(log) {
  //     console.log("TransferSingle log:", log)
  //   },
  // })

## Yarn / NEXT 

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
