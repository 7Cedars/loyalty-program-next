// NB! BEFORE publishing this project, I need to actually copy-paste ABIs. This setup is for dev only.  

import { Abi } from "viem"
import loyaltyProgram from "../../../loyalty-program-contracts/out/LoyaltyProgram.sol/LoyaltyProgram.json"
import loyaltyGift from "../../../loyalty-program-contracts/out/LoyaltyGift.sol/LoyaltyGift.json"
import erc6551Account from "../../../loyalty-program-contracts/out/ERC6551Account.sol/ERC6551Account.json"

export const loyaltyProgramAbi: Abi = JSON.parse(JSON.stringify(loyaltyProgram.abi)) // why?! why, why, why? It is NOT possible to directly import it. 
export const loyaltyGiftAbi: Abi = JSON.parse(JSON.stringify(loyaltyGift.abi)) 
export const ERC6551AccountAbi: Abi = JSON.parse(JSON.stringify(erc6551Account.abi)) 


// [
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "uri",
//         "type": "string"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "sender",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "balance",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "needed",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "tokenId",
//         "type": "uint256"
//       }
//     ],
//     "name": "ERC1155InsufficientBalance",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "approver",
//         "type": "address"
//       }
//     ],
//     "name": "ERC1155InvalidApprover",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "idsLength",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "valuesLength",
//         "type": "uint256"
//       }
//     ],
//     "name": "ERC1155InvalidArrayLength",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "operator",
//         "type": "address"
//       }
//     ],
//     "name": "ERC1155InvalidOperator",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "receiver",
//         "type": "address"
//       }
//     ],
//     "name": "ERC1155InvalidReceiver",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "sender",
//         "type": "address"
//       }
//     ],
//     "name": "ERC1155InvalidSender",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "operator",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "owner",
//         "type": "address"
//       }
//     ],
//     "name": "ERC1155MissingApprovalForAll",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__CardCanOnlyReceivePoints",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__InSufficientPoints",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__InSufficientPointsOnCard",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       }
//     ],
//     "name": "LoyaltyProgram__IncorrectContractInterface",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__LoyaltyCardNotAvailable",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__LoyaltyCardNotRecognised",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__LoyaltyTokenNotClaimable",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__LoyaltyTokenNotOnCard",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__LoyaltyTokenNotRecognised",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__LoyaltyTokenNotRedeemable",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__OnlyOwner",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__TransferDenied",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__VendorLoyaltyCardCannotBeTransferred",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "ReentrancyGuardReentrantCall",
//     "type": "error"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       }
//     ],
//     "name": "AddedLoyaltyTokenContract",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "account",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "operator",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "bool",
//         "name": "approved",
//         "type": "bool"
//       }
//     ],
//     "name": "ApprovalForAll",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "owner",
//         "type": "address"
//       }
//     ],
//     "name": "DeployedLoyaltyProgram",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       }
//     ],
//     "name": "RemovedLoyaltyTokenClaimable",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       }
//     ],
//     "name": "RemovedLoyaltyTokenRedeemable",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "operator",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "from",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256[]",
//         "name": "ids",
//         "type": "uint256[]"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256[]",
//         "name": "values",
//         "type": "uint256[]"
//       }
//     ],
//     "name": "TransferBatch",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "operator",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "from",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "id",
//         "type": "uint256"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "value",
//         "type": "uint256"
//       }
//     ],
//     "name": "TransferSingle",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "value",
//         "type": "string"
//       },
//       {
//         "indexed": true,
//         "internalType": "uint256",
//         "name": "id",
//         "type": "uint256"
//       }
//     ],
//     "name": "URI",
//     "type": "event"
//   },
//   {
//     "inputs": [],
//     "name": "LOYALTY_POINTS",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address payable",
//         "name": "loyaltyToken",
//         "type": "address"
//       }
//     ],
//     "name": "addLoyaltyTokenContract",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "account",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "id",
//         "type": "uint256"
//       }
//     ],
//     "name": "balanceOf",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address[]",
//         "name": "accounts",
//         "type": "address[]"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "ids",
//         "type": "uint256[]"
//       }
//     ],
//     "name": "balanceOfBatch",
//     "outputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "",
//         "type": "uint256[]"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "loyaltyCardId",
//         "type": "uint256"
//       }
//     ],
//     "name": "getBalanceLoyaltyCard",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       }
//     ],
//     "name": "getLoyaltyToken",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getNumberLoyaltyCardsMinted",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getOwner",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "_loyaltyCardId",
//         "type": "uint256"
//       }
//     ],
//     "name": "getTokenBoundAddress",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "tokenBoundAccount",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "account",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "operator",
//         "type": "address"
//       }
//     ],
//     "name": "isApprovedForAll",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "numberOfLoyaltyCards",
//         "type": "uint256"
//       }
//     ],
//     "name": "mintLoyaltyCards",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "numberOfPoints",
//         "type": "uint256"
//       }
//     ],
//     "name": "mintLoyaltyPoints",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address payable",
//         "name": "loyaltyTokenAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "numberOfTokens",
//         "type": "uint256"
//       }
//     ],
//     "name": "mintLoyaltyTokens",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "",
//         "type": "uint256[]"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "",
//         "type": "uint256[]"
//       },
//       {
//         "internalType": "bytes",
//         "name": "",
//         "type": "bytes"
//       }
//     ],
//     "name": "onERC1155BatchReceived",
//     "outputs": [
//       {
//         "internalType": "bytes4",
//         "name": "",
//         "type": "bytes4"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       },
//       {
//         "internalType": "bytes",
//         "name": "",
//         "type": "bytes"
//       }
//     ],
//     "name": "onERC1155Received",
//     "outputs": [
//       {
//         "internalType": "bytes4",
//         "name": "",
//         "type": "bytes4"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address payable",
//         "name": "loyaltyToken",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyPoints",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyCardId",
//         "type": "uint256"
//       }
//     ],
//     "name": "redeemLoyaltyPoints",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address payable",
//         "name": "loyaltyToken",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyTokenId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "loyaltyCardAddress",
//         "type": "address"
//       }
//     ],
//     "name": "redeemLoyaltyToken",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       }
//     ],
//     "name": "removeLoyaltyTokenClaimable",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       }
//     ],
//     "name": "removeLoyaltyTokenRedeemable",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "s_erc6551Implementation",
//     "outputs": [
//       {
//         "internalType": "contract ERC6551Account",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "s_erc6551Registry",
//     "outputs": [
//       {
//         "internalType": "contract ERC6551Registry",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "from",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "ids",
//         "type": "uint256[]"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "values",
//         "type": "uint256[]"
//       },
//       {
//         "internalType": "bytes",
//         "name": "data",
//         "type": "bytes"
//       }
//     ],
//     "name": "safeBatchTransferFrom",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "from",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "id",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "value",
//         "type": "uint256"
//       },
//       {
//         "internalType": "bytes",
//         "name": "data",
//         "type": "bytes"
//       }
//     ],
//     "name": "safeTransferFrom",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "operator",
//         "type": "address"
//       },
//       {
//         "internalType": "bool",
//         "name": "approved",
//         "type": "bool"
//       }
//     ],
//     "name": "setApprovalForAll",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "bytes4",
//         "name": "interfaceId",
//         "type": "bytes4"
//       }
//     ],
//     "name": "supportsInterface",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "uri",
//     "outputs": [
//       {
//         "internalType": "string",
//         "name": "",
//         "type": "string"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "stateMutability": "payable",
//     "type": "receive"
//   }
// ]

//   export const loyaltyTokenAbi: Abi = [
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "loyaltyTokenUri",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "sender",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "balance",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "needed",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "ERC1155InsufficientBalance",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "approver",
//           "type": "address"
//         }
//       ],
//       "name": "ERC1155InvalidApprover",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "idsLength",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "valuesLength",
//           "type": "uint256"
//         }
//       ],
//       "name": "ERC1155InvalidArrayLength",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         }
//       ],
//       "name": "ERC1155InvalidOperator",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "receiver",
//           "type": "address"
//         }
//       ],
//       "name": "ERC1155InvalidReceiver",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "sender",
//           "type": "address"
//         }
//       ],
//       "name": "ERC1155InvalidSender",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "name": "ERC1155MissingApprovalForAll",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "loyaltyToken",
//           "type": "address"
//         }
//       ],
//       "name": "LoyaltyToken__InsufficientPoints",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "loyaltyToken",
//           "type": "address"
//         }
//       ],
//       "name": "LoyaltyToken__LoyaltyProgramNotRecognised",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "loyaltyToken",
//           "type": "address"
//         }
//       ],
//       "name": "LoyaltyToken__NftNotOwnedByloyaltyCard",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "loyaltyToken",
//           "type": "address"
//         }
//       ],
//       "name": "LoyaltyToken__NoTokensAvailable",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "loyaltyToken",
//           "type": "address"
//         }
//       ],
//       "name": "LoyaltyToken__RequirementsNotMet",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "loyaltyToken",
//           "type": "address"
//         }
//       ],
//       "name": "LoyaltyToken__TokenNotOwned",
//       "type": "error"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "bool",
//           "name": "approved",
//           "type": "bool"
//         }
//       ],
//       "name": "ApprovalForAll",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "issuer",
//           "type": "address"
//         }
//       ],
//       "name": "DiscoverableLoyaltyToken",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256[]",
//           "name": "ids",
//           "type": "uint256[]"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256[]",
//           "name": "values",
//           "type": "uint256[]"
//         }
//       ],
//       "name": "TransferBatch",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "id",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         }
//       ],
//       "name": "TransferSingle",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "value",
//           "type": "string"
//         },
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "id",
//           "type": "uint256"
//         }
//       ],
//       "name": "URI",
//       "type": "event"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "id",
//           "type": "uint256"
//         }
//       ],
//       "name": "balanceOf",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address[]",
//           "name": "accounts",
//           "type": "address[]"
//         },
//         {
//           "internalType": "uint256[]",
//           "name": "ids",
//           "type": "uint256[]"
//         }
//       ],
//       "name": "balanceOfBatch",
//       "outputs": [
//         {
//           "internalType": "uint256[]",
//           "name": "",
//           "type": "uint256[]"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "loyaltyCard",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "loyaltyProgram",
//           "type": "address"
//         }
//       ],
//       "name": "claimLoyaltyToken",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "loyaltyProgram",
//           "type": "address"
//         }
//       ],
//       "name": "getAvailableTokens",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         }
//       ],
//       "name": "isApprovedForAll",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "numberOfTokens",
//           "type": "uint256"
//         }
//       ],
//       "name": "mintLoyaltyTokens",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "loyaltyCard",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "redeemLoyaltyToken",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "requirementsLoyaltyTokenMet",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "success",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256[]",
//           "name": "ids",
//           "type": "uint256[]"
//         },
//         {
//           "internalType": "uint256[]",
//           "name": "values",
//           "type": "uint256[]"
//         },
//         {
//           "internalType": "bytes",
//           "name": "data",
//           "type": "bytes"
//         }
//       ],
//       "name": "safeBatchTransferFrom",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "id",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bytes",
//           "name": "data",
//           "type": "bytes"
//         }
//       ],
//       "name": "safeTransferFrom",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         },
//         {
//           "internalType": "bool",
//           "name": "approved",
//           "type": "bool"
//         }
//       ],
//       "name": "setApprovalForAll",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes4",
//           "name": "interfaceId",
//           "type": "bytes4"
//         }
//       ],
//       "name": "supportsInterface",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "uri",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "stateMutability": "payable",
//       "type": "receive"
//     }
//   ]

// export const ERC6551AccountAbi: Abi = [
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "target",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "bytes",
//           "name": "data",
//           "type": "bytes"
//         }
//       ],
//       "name": "TransactionExecuted",
//       "type": "event"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bytes",
//           "name": "data",
//           "type": "bytes"
//         }
//       ],
//       "name": "executeCall",
//       "outputs": [
//         {
//           "internalType": "bytes",
//           "name": "result",
//           "type": "bytes"
//         }
//       ],
//       "stateMutability": "payable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "hash",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "bytes",
//           "name": "signature",
//           "type": "bytes"
//         }
//       ],
//       "name": "isValidSignature",
//       "outputs": [
//         {
//           "internalType": "bytes4",
//           "name": "magicValue",
//           "type": "bytes4"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "nonce",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256[]",
//           "name": "",
//           "type": "uint256[]"
//         },
//         {
//           "internalType": "uint256[]",
//           "name": "",
//           "type": "uint256[]"
//         },
//         {
//           "internalType": "bytes",
//           "name": "",
//           "type": "bytes"
//         }
//       ],
//       "name": "onERC1155BatchReceived",
//       "outputs": [
//         {
//           "internalType": "bytes4",
//           "name": "",
//           "type": "bytes4"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bytes",
//           "name": "",
//           "type": "bytes"
//         }
//       ],
//       "name": "onERC1155Received",
//       "outputs": [
//         {
//           "internalType": "bytes4",
//           "name": "",
//           "type": "bytes4"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "owner",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "owner1155",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes4",
//           "name": "interfaceId",
//           "type": "bytes4"
//         }
//       ],
//       "name": "supportsInterface",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "pure",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "token",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "stateMutability": "payable",
//       "type": "receive"
//     }
//   ]
