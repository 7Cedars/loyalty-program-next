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
- [ ]  @Vendor, Tokens: BUG: When tokens cannot be loaded it goes into a loop. Fix! 
- [ ]  @Vendor, QrReader: Fix Bug that when no valid QR code is read - it just hangs. Needs to have notification + continue reading.
- [ ]  @Vendor, landing: 'visit page' is broken. Fix. 
- [ ]  @Everywhere: No testing has been implemented yet. Implement Cyprus 
- [ ]  @vendor (& @customer?) when their are no transactions, transaction overview hangs at 'retrieving transaction history...'  

## Improvements to implement (in order of priority)
<!-- go through this list and check how many I have already fixed -->
- [ ]  @Vendor, QrReader, SendPoints: add mint points button + how many points left line. 
- [ ]  @LandingPage: update text to reflect only deployed on OP sepolia. 
- [ ]  @Everywhere: create new content loyalty programs. Inkscape + metadata.  
- [ ]  @LandingPage: update images of loyalty program. -- show off app. 
- [ ]  Clean up redux - modal visibility can be removed completely. 
- [ ]  @Notifications / Everywhere: Error messaging needs to mention revert message. - currently no idea why something fails.
- [ ]  @Everywhere: Gift, Voucher, Token... Get a clear logic, and implement consistently throughout. - WIP but lot better now. 
- [ ]  @Vendor, Tokens: Build a easy UI for adding and removing gift contracts / later
- [ ]  @Vendor, tokens: Add address of token + address issuer in description. / later
