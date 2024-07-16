export const WHITELIST_TOKEN_ISSUERS_FOUNDRY = ["0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"]
export const WHITELIST_TOKEN_ISSUERS_SEPOLIA = []
export const VERSION_GIFTS = "alpha.3"  
export const VERSION_PROGRAM = "alpha.3"

export const SUPPORTED_CHAINS = [ // blocks to start check for data. 
  {
    name: "foundry", 
    chainId: 31337, 
    fromBlock: 0n, 
    account6551Address: "0x8e48a688ca8374fe5012c252c2023Fe451d36e5c"
  },
  {
    name: "sepolia", 
    chainId: 11155111, 
    fromBlock: 5000000n,
    account6551Address: "0x0000000000000000000000000000000000000000"
  },
  {
    name: "arbitrumSepolia", 
    chainId: 421614, 
    fromBlock: 25888893n,
    account6551Address: "0x0000000000000000000000000000000000000000"
  },
  {
    name: "baseSepolia", 
    chainId: 84532, 
    fromBlock: 0n,
    account6551Address: "0x0000000000000000000000000000000000000000"
  },
  {
    name: "optimismSepolia", 
    chainId: 11155420, 
    fromBlock: 14000000n,
    account6551Address: "0x2ff1d4ef7c15cd418db2a893376dd84aa0a8e145"
  },
  {
    name: "polygonMumbai", 
    chainId: 80001, 
    fromBlock: 47542540n,
    account6551Address: "0x0000000000000000000000000000000000000000"
  }
]
