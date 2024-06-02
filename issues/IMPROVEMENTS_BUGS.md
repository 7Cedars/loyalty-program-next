## Loyalty Program Next 
**Frontend of blockchain based modular platform for loyalty programs**
<!-- £todo edit text here. -->

This repository is meant as initial playground to develop and test front end as I develop to solidity backend. 
Even though repository is public, For now, it is for personal use only. 

## Idea and Design
- Create an open and modular blockchain based framework for loyalty programs. 
- Aimed at small and medium sized shops and companies. 
- eventually deploy on multiple blockchains. 
- Design of solidity frontend is on my Figma.

## Know bugs (in order of priority)
- [ ] @everywhere clean up console.logs  
- [ ] @everywhere, unify UI language (WIP - should check how far I've gotten. )  
  - [ ]  disabled button = emptyGray & 50% opacity. 
  - [ ]  contractWrite positive: = emptyGreen
  - [ ]  contractWrite negative: = emptyRed
  - [ ]  Go to other place in app = emptyGray 
  - [ ]  messaging to user should happen through button with two exceptions: 
    - [ ]  positive interaction blockchain = green notification 
    - [ ]  error with blockchain = red notification. 
- [ ]  @landing: add red message on top: this is a test app / MVP. 
- [ ]  @Vendor, QrReader, sent cards: when no card is available, button should be disabled 
- [x]  @Vendor, landing: 'visit page' is broken. Fix. 
- [x]  @Vendor, landing: 'visit page' theming is broken. Fix. -- still some buttons' ui broken. 
- [x]  @vendor, stats: balance not loading. Fix. -- problem does not exist at customer.. 
- [ ]  @Vendor, QrReader: Fix Bug that when no valid QR code is read - it just hangs. Needs to have notification + continue reading. (more or less ok now I think)
- [ ]  @Vendor, QrReader, send card: it seems multiple cards of same cardID can be send to same (also different?) addresses. FIX later.
- [x]  @Vendor, QrReader, sent cards: Fix Bug that when no card are available, no message shows. 
- [ ]  @Vendor, QrReader, sent cards: Fix Bug that number cards does not update (and that multiple cards of same id can be sent?!). 
- [x]  @vendor, QrScan: Mint cards still shows, even if scanned a code. -- ONLY WHEN NO Cards have been minted!
- [x]  @vendor (& @customer?) when their are no transactions, transaction overview hangs at 'retrieving transaction history...'  
- [x]  @customer, claim gifts: -- claim gift or voucher distinction does not work. 
  - [x]  This is because token addresses are loaded differently in this view. At useLoyaltyGift it skips the first step - in which tokenised was loaded. Will take quite a bit of work to fix. Note that I probably will refactor gift contracts - which should also hel fix this bug. 
- [x]  @Vendor, select gifts: selecting gifts and minting should be decoupled: you should be able to mint gifts that are NOT selected to be claimed! (because many tokens can actually not be claimed..)
- [ ]  @Vendor, SelectGifts: all gifts metadata has to be updated to include png + new metadata. -> the reupload to pinata.  
- [x]  @customer & vendor -- disconnected view: should also show reocnnecting... (without login button)
- [x]  @customer: should show if requirements are not met - does not work at the moment! 
- [x]  @customer, your card: Loyalty points do not update. 
- [ ]  @customer: when vsiting the customer url without going through customerLanding page first - it just keeps loading. It should give warning. 
- [ ]  @customer, transactions: received points show up double. 
- [x]  @Vendor, Tokens: BUG: When tokens cannot be loaded it goes into a loop. Fix! 
- [ ]  @customer, home: add button to request new card. 
- [x]  @everwhere: reconnecting message shows login -> remove. 
- [ ]  @Everywhere: No testing has been implemented yet. Implement Cyprus 

## Improvements to implement (in order of priority)
<!-- go through this list and check how many I have already fixed -->
- [x]  @Vendor, QrReader, SendPoints: add mint points button + how many points left line. 
- [x]  @Vendor, Select gifts: create easy way to transfer gifts to customer (bypassing request logic)? 
- [ ]  @LandingPage: update text to reflect only deployed on OP sepolia. 
- [x]  @Everywhere: create new content loyalty programs. Inkscape + metadata.  
- [x]  @LandingPage: update images of loyalty program. -- show off app. 
- [x]  Clean up redux - modal visibility can be removed completely. 
- [ ]  @Notifications / Everywhere: Error messaging needs to mention revert message. - currently no idea why something fails.
- [x]  @Everywhere: Gift, Voucher, Token... Get a clear logic, and implement consistently throughout. - WIP but lot better now. 
- [ ]  @Vendor, Tokens: Build a easy UI for adding and removing gift contracts / later
- [ ]  @Vendor, tokens: Add address of token + address issuer in description. / later
