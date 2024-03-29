export const WHITELIST_TOKEN_ISSUERS_FOUNDRY = ["0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"]
export const WHITELIST_TOKEN_ISSUERS_SEPOLIA = []
export const SUPPORTED_CHAINS = [ // blocks to start check for data. 
  {
    name: "foundry", 
    chainId: 33137, 
    fromBlock: 0n, 
    accountImplementation: "0x0b651850F1b7EA080A0039119dEEE7Cc7516706E" // TBI -- should use create2 to always have same address. 
  },
  {
    name: "sepolia", 
    chainId: 11155111, 
    fromBlock: 5000000n, 
    accountImplementation: "0x0b651850F1b7EA080A0039119dEEE7Cc7516706E" // TBI
  },
  {
    name: "arbitrumSepolia", 
    chainId: 421614, 
    fromBlock: 25888893n,
    accountImplementation: "0x0b651850F1b7EA080A0039119dEEE7Cc7516706E" 
  },
  {
    name: "baseSepolia", 
    chainId: 84532, 
    fromBlock: 0n, // TBI
    accountImplementation: "0x0b651850F1b7EA080A0039119dEEE7Cc7516706E" // TBI
  },
  {
    name: "optimismSepolia", 
    chainId: 11155420, 
    fromBlock: 0n,  // TBI
    accountImplementation: "0x0b651850F1b7EA080A0039119dEEE7Cc7516706E" // TBI
  },
  {
    name: "polygonMumbai", 
    chainId: 80001, 
    fromBlock: 47542540n,
    accountImplementation: "0x37dc8bd57ca11e64e93d5a6dbe253a7ef744f38e"
  }
]
