## To do list for customer / claim page 

- [ ] requirements:  
- [ ] Login, Landing, points pages completed. 
- [ ] Also: need to have solidity backend properly deployed on local anvil chain. 
  - [ ] With a few example loyalty programs, tokens and card holders (customers).     
- [ ] Should have read up on how to check logs.

When requirements are met: 
- [ ] At top of page state total amount of points collected. 
- [ ] Rest of page is a grid of possible tokens to selects. 
- [ ] Each token consists of: 
  - [ ] Square image of token. 
  - [ ] Points needed to claim. 
  - [ ] Brief description of additional claim requirements. 
  - [ ] Brief description of what can be redeemed for this token. 
- [ ] Each token is grayed / has green or red border / some visual cue to indicate if customer meets requirements to claim. 
- [ ] When token is clicked, modal appears:
  - [ ] Large image 
  - [ ] Points needed to claim. 
  - [ ] Long description of additional claim requirements. 
  - [ ] Long description of what can be redeemed for this token.
  - [ ] if requirement are not met: brief description why.  
  - [ ] Button: redeem (disabled if requirements not met)
- [ ] The grid is populated through queriing the contracts. 
