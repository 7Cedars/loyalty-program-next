export const WHITELIST_TOKEN_ISSUERS_FOUNDRY = ["0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"]
export const WHITELIST_TOKEN_ISSUERS_SEPOLIA = []
export const VERSION_GIFTS = "alpha.2"  
export const VERSION_PROGRAM = "alpha.2"

export const SUPPORTED_CHAINS = [ // blocks to start check for data. 
  {
    name: "foundry", 
    chainId: 31337, 
    fromBlock: 0n
  },
  {
    name: "sepolia", 
    chainId: 11155111, 
    fromBlock: 5000000n
  },
  {
    name: "arbitrumSepolia", 
    chainId: 421614, 
    fromBlock: 25888893n,
  },
  {
    name: "baseSepolia", 
    chainId: 84532, 
    fromBlock: 0n
  },
  {
    name: "optimismSepolia", 
    chainId: 11155420, 
    fromBlock: 11147192n
  },
  {
    name: "polygonMumbai", 
    chainId: 80001, 
    fromBlock: 47542540n
  }
]
