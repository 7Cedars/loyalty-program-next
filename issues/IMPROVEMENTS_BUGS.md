## Loyalty Program Next 
**Frontend of blockchain based modular platform for loyalty programs**

This repository is meant as initial playground to develop and test front end as I develop to solidity backend. 
Even though repository is public, For now, it is for personal use only. 

## Idea and Design
- Create an open and modular blockchain based framework for loyalty programs. 
- Aimed at small and medium sized shops and companies. 
- eventually deploy on multiple blockchains. 
- Design of solidity frontend is on my Figma. 

# Deploy todo
- [ ]  Deploy on Vercel 

## Know bugs (in order of priority)
- [x]  @ChooseProgram: Carousel is broken. fix. 
- [ ]  @Vendor, Tokens: BUG: When tokens cannot be loaded it goes into a loop. Fix! 
- [ ]  @Vendor, QrReader: Fix Bug that when no valid QR code is read - it just hangs. Needs to have notification + continue reading.
- [x]  @LandingPage: when program is deployed, now all programs say 'visit'. It should only be for program deployed. 
- [x]  @Everywhere: I updated / optimised contract - will need to check if app still functions. 
- [ ]  @Everywhere: No testing has been implemented yet. Implement Cyprus 
  - [ ]  NB: it might be quite challenging: how to test QR reader, interaction with wallet?  
  - [ ]  Need to subdivide per page.  
- [x]  @vendor, login: why does web3modal not show?!  Fix! 
- [ ]  ... 

## Improvements to implement (in order of priority)
- [x]  @Everywhere: vertical scaling has to also be correct through out (see minting at vendor stats page for correct example) - not quite there yet, but getting closer
- [x]  @vendor, SelectLoyaltyGift: While loading, should show loading image.
- [x]  @vendor, SelectLoyaltyGift: on pixel7 screen should show two rows of gifts.
- [x]  @vendor, Landing page: improve vertical alignment items. ok-ish
- [x]  @ui: make Numline flow across into two lines on small screens. 
- [x]  @vendor, Qrcode: add spacing around scanner.  
- [x]  @vendor, ChooseProgram: fix carousel.  
- [x]  @Everywhere: Develop, update loading image.  
- [x]  @Everywhere: Develop dark theming: Next adds dark theming automatically! WIP 
  - [x]  Bg main modal should be slate -- see landing page (maybe bit more lighter & darker)
  - [x]  standardized fonts should have dark mode - very simple to do actually. 
  - [x]  .. then check on phone what I missed. 
- [ ]  @vendor, stats: see remainign points and cards. Fix layouting.  
- [x]  @Everywhere: Use sleet version of button throughout app (consistency with landing page).  
- [x]  @Vendor, Home: add mint card button + how many cards left line. 
- [ ]  @Vendor, QrReader, SendPoints: add mint points button + how many points left line. 
- [x]  @DynamicLayout: can I turn off scrolling altogether? 
- [x]  @LandingPage: create several different images through the page. -- show off app. 
- [ ]  Clean up redux - modal visibily can be removed completely. 
- [x]  @LandingPage: visit button should be simple link / same with get started button. OR make whole button a link! 
- [x]  @LandingPage: set max width. 
- [x]  @Everywhere: change loading image from 'vercel' one to turning indicator.    
- [x]  @Customer, Home: improve carousel if multiple cards are present -- see example landing page. 
- [x]  @Vendor, Home: improve carousel if multiple programs have been deployed -- see example landing page. 
- [ ]  @Notifications / Everywhere: Error messaging needs to mention revert message. - currently no idea why something fails. 
- [x]  @Customer, Home: When loyaltyCard is received you know have to reload page - is should go straight to the new card. -> use window.location.reload(); - actually not really needed. On phone this is quite natural. 
- [ ]  @Everywhere: Gift, Voucher, Token... Get a clear logic, and implement consistently throughout. - WIP but lot better now. 
- [x]  @Vendor, Home: If no programs are deployed - should have link to landing page - very simple (now just shows up empty). 
- [ ]  @Vendor, Tokens: Build a easy UI for adding and removing gift contracts / later
- [ ]  @Vendor, tokens: Add address of token + address issuer in description. / later 
- [x]  @Readme.md: Search for templates to create clear and accesible readme file. 
- [ ]  fill out readme files. - WIP  

## Additional notes 
  // NB: use of useContractEvent versus waitForTransaction (viem) versus useWaitForTransaction (wagmi) to check confirmaiton of transaction
  // has to be tried out on actual test network. Not anvil. 
  /// 
  // useContractEvent({
  //   address: parseEthAddress(selectedLoyaltyProgram?.programAddress),
  //   abi: loyaltyProgramAbi,
  //   eventName: 'TransferSingle',
  //   listener(log) {
  //     console.log("TransferSingle log:", log)
  //   },
  // })
