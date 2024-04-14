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
- [x]  @Vendor, landing: 'visit page' is broken. Fix. 
- [x]  @Vendor, landing: 'visit page' theming is broken. Fix. -- still some buttons' ui broken. 
- [x]  @vendor, stats: balance not loading. Fix. -- problem does not exist at customer.. 
- [ ]  @customer, claim gifts: -- claim gift or voucher distinction does not work. 
  - [ ]  This is because token addresses are loaded differently in this view. At useLoyaltyGift it skips the first step - in which tokenised was loaded. Will take quite a bit of work to fix. Note that I probably will refactor gift contracts - which should also hel fix this bug. 
- [x]  @Vendor, select gifts: selecting gifts and minting should be decoupled: you should be able to mint gifts that are NOT selected to be claimed! (because many tokens can actually not be claimed..)
- [ ]  @Vendor, SelectGifts: gifts metadata of old gifts is still old. Have to link to correct URI. (and possibly reupload.) 
- [x]  @customer & vendor -- disconnected view: should also show reocnnecting... (without login button)
- [ ]  @customer: should show if requirements are not met - does not work at the moment! 
- [ ]  @customer, your card: Loyalty points do not update. 
- [ ]  @customer, transactions: received points show up double. 
- [ ]  @vendor (& @customer?) when their are no transactions, transaction overview hangs at 'retrieving transaction history...'  
- [x]  @Vendor, Tokens: BUG: When tokens cannot be loaded it goes into a loop. Fix! 
- [ ]  @Vendor, QrReader: Fix Bug that when no valid QR code is read - it just hangs. Needs to have notification + continue reading.
- [ ]  @vendor, QrScan: Mint cards still shows, even if scanned a code. -- ONLY WHEN NO Cards have been minted!
- [ ]  @customer, home: add button to request new card. 
- [x]  @everwhere: reconnecting message shows login -> remove. 
- [ ]  @Everywhere: No testing has been implemented yet. Implement Cyprus 

## Improvements to implement (in order of priority)
<!-- go through this list and check how many I have already fixed -->
- [ ]  @Vendor, QrReader, SendPoints: add mint points button + how many points left line. 
- [ ]  @Vendor, Select gifts: create easy way to transfer gifts to customer (bypassing request logic)? 
- [ ]  @LandingPage: update text to reflect only deployed on OP sepolia. 
- [ ]  @Everywhere: create new content loyalty programs. Inkscape + metadata.  
- [ ]  @LandingPage: update images of loyalty program. -- show off app. 
- [ ]  Clean up redux - modal visibility can be removed completely. 
- [ ]  @Notifications / Everywhere: Error messaging needs to mention revert message. - currently no idea why something fails.
- [ ]  @Everywhere: Gift, Voucher, Token... Get a clear logic, and implement consistently throughout. - WIP but lot better now. 
- [ ]  @Vendor, Tokens: Build a easy UI for adding and removing gift contracts / later
- [ ]  @Vendor, tokens: Add address of token + address issuer in description. / later
