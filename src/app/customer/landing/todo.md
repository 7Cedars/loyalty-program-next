## To do list for customer / landing page 

- [ ] requirements:  
- [ ] First build login page, before starting here. 
- [ ] Also: need to have solidity backend properly deployed on local anvil chain. 
  - [ ] With a few example loyalty programs, tokens and card holders (customers).     
- [ ] read up on how to check ownership of NFTs using 1155. Reading logs. 
  - [ ] Did I have something like this already in my previous app? (don't think so...) 

When requirements are met: 
- [ ] TWO different pages for when a loyalty card address is present, or not. 
- [ ] If loyalty card address is not present: 
  - [ ] create horizontal scroll along owned loyalty cards. 
    - [ ] These cards are retrieved from blockchain logs. 
    - [ ] If only one card exists, it is automatically selected.
    - [ ] Selecting a card leads to NEW URL: address of loyalty card added.
  - [ ] If loyalty card address is present, show immediately a modal: 
    - [ ] with QR code: address of loyalty program + tokenId of loyalty card
    - [ ] text: let vendor scan this QR code to receive loyalty points. (or sth like this) 
    - [ ] if customer has multiple cards, should include button: select other card. 
  - [ ] When modal is deselected, only image of loyalty program remains + navbar.  
  - [ ] If screen is tapped anywhere, modal reappears. 
  - [ ] Additional notes: 
    - [ ] The points, claim and redeem pages ALWAYS have address of loyalty card added to their url.
    - [ ] Still have to figure out what sequence is best in url - see my prev project. 

