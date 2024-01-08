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
- [ ]  Implement minting loyaltyTokens 
  - [x]  Write to contract
  - [ ]  Listen for correct event. 
  - [x]  Show loading circle when loading
  - [ ]  show green notification when successful
  - [ ]  red if error returned. 
- [ ]  Stats page: 
  - [ ]  Include at top view # tokens & # points 
- [ ]  Develop QR reading page
  - [x]  Image of QR reading should fit whole modal + QR reading frame should be super imposed over this. 
  - [x]  Use QR create app on phone to create QR codes
  - [ ]  Implement correct triggers: 
    - [x]  When seeing address -> send new loyalty card. 
      - [x]  show green notification when successful
      - [x]  red if error returned.
    - [ ]  When seeing card ID + program address -> send points.
      - [ ]  show green notification when successful
      - [ ]  red if error returned. 
    - [ ]  When seeing token ID + token address + loyalty prgram address -> redeem token.
      - [ ] show green notification when successful
      - [ ]  red if error returned.
- [ ]  Develop ui elements 
  - [ ]  scaling has to take into account screens of width as low as 350px. 
  - [ ]  scaling height has to be correct through out (see minting at vendor stats page for correct example)
- [ ]  simplify layout by moving files from components to top folder

CUSTOMER APP 
- [ ]   fix home - choose card screen 
- [ ]   implement claim tokens
  - [ ]   Call function via card - see viem abiEncode. 
  - [ ]   Wait for transaction to clear (with new function I found?)
- [ ]   implemen redeem token. 
  - [ ]   Call function via card - see viem abiEncode. 
  - [ ]   Wait for transaction to clear (with new function I found?) 
- [ ]   simplify layout by moving files from components to top folder


GENERAL 
- [ ]  Deploy on Vercel 
- [ ]  Deploy on test net
  - [ ]  First on branched Sepolia network in Foundry.
  - [ ]  Then Sepolia.  

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
