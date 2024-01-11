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
VENDOR APP 
- [x]  Implement minting loyaltyTokens 
  - [x]  Write to contract
  - [x]  Listen for correct event. 
  - [x]  Show loading circle when loading
  - [x]  show green notification when successful
  - [x]  red if error returned. 
- [ ]  Selection token page: 
  - [ ]  add minted number of tokens + remaining 
  - [ ]  Add address of token + address issuer in description.
- [x]  Stats page: 
  - [x]  Include at top view # tokens & # points 
- [ ]  Develop QR reading page
  - [x]  Image of QR reading should fit whole modal + QR reading frame should be super imposed over this. 
  - [x]  Use QR create app on phone to create QR codes
  - [ ]  Implement correct triggers: 
    - [x]  When seeing address -> send new loyalty card. 
      - [x]  show green notification when successful
      - [x]  red if error returned.
    - [x]  When seeing card ID + program address -> send points.
      - [x]  show green notification when successful
      - [x]  red if error returned. 
    - [x]  When seeing token ID + token address + loyalty prgram address -> redeem token.
      - [ ] show green notification when successful
      - [ ] red if error returned.
  
CUSTOMER APP 
- [x]   fix home 
  - [ ]   choose card screen: add points 
  - [x]   fix layout 
  - [x]   add address card at overview / choice cards 
  - [x]   Needs to properly update when changing address
- [x]   Transfer LoyaltyCard
  - [x]   At the moment does not work when scanning QrCode. FIX 
  - [x]   Make sure a notification is shown at customer side when card is received + reload to show card. 
- [x]   implement claim tokens
  - [x]   Call function via card - see viem abiEncode. 
  - [x]   Wait for transaction to clear (with new function I found?)
  - [x]   show green notification when successful
  - [x]   red if error returned. 
- [x]   implemen redeem token. 
  - [x]   Call function via card - see viem abiEncode. 
  - [x]   Wait for transaction to clear (with new function I found?) 
  - [x]   Fix showing tokens to be redeemed (now when you redeem a NEW item appears..)
  -       Show timer: "Qr code is valid for ... second" - after which approvalForAll is set to false. // has to be implemented in contract 
  - [x]   show green notification when successful
  - [x]   show additional green notification when vendor accepted redeem. - then return to main screen. 
  - [x]   show red notification if error returned. 
- [x]   Build hook useLatestCustomerTransaction 
  - [x]   read received points
  - [x]   read transferred points
  - [x]   read claimed tokens 
  - [x]   read redeemed tokens 
- [ ]   Code clean up (small issue - can leave as is)
  - [ ]   Add points of cards to redux store - no need to keep on readin chain.  

GENERAL 
- [ ]  Test layout / ui / ux 
  - [x]  Has to work from very wide (my full screen) to very narrow (350px) 
  - [ ]  vertical scaling has to also be correct through out (see minting at vendor stats page for correct example)
  - [ ]  fix any other ui/ux issues that pop up. 
- [ ]  Simplify folder structure by moving files from components to top folder oin both vendor and customer app 
  - [x]  create a custom hook: 'useLoyaltyTokens'. params = {LoyaltyTokens, status (loading, isSuccess, isError), refetching}.  -- build as much as possible on code that I have. 
  - [ ]  replace all the parts where I load LoyaltyTokens with this custom hook. 
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
