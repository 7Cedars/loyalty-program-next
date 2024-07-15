## Loyalty Program Next 
**Frontend of blockchain based modular platform for loyalty programs**

## Know bugs (in order of priority)
- [ ] @everywhere, unify UI language (80% )  
    - [ ]  positive interaction blockchain = green notification 
    - [ ]  error with blockchain = red notification. 
- [ ]  @landing: add red message on top: this is a test app / MVP. 
- [ ]  @Vendor, QrReader, sent cards: when no card is available, button should be disabled 
- [ ]  @Vendor, QrReader: Fix Bug that when no valid QR code is read - it just hangs. Needs to have notification + continue reading. (more or less ok now I think)
- [ ]  @Vendor, QrReader, send card: it seems multiple cards of same cardID can be send to same (also different?) addresses. FIX later.
- [ ]  @Vendor, QrReader, sent cards: Fix Bug that number cards does not update (and that multiple cards of same id can be sent?!). 
- [ ]  @customer: when vsiting the customer url without going through customerLanding page first - it just keeps loading. It should give warning. 
- [ ]  @customer, transactions: received points show up double. 
- [ ]  @customer, home: add button to request new card. 
- [ ]  @Everywhere: No testing has been implemented yet. Implement Cyprus 

## Improvements to implement (in order of priority)
- [ ]  @Notifications / Everywhere: Error messaging needs to mention revert message. - currently no idea why something fails.
- [ ]  @Vendor, Tokens: Build a easy UI for adding and removing gift contracts / later
- [ ]  @Vendor, tokens: Add address of token + address issuer in description. / later
