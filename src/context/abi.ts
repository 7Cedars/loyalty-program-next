// NB! BEFORE publishing this project, I need to actually copy-paste ABIs. This setup is for dev only.  

import { Abi } from "viem"
import loyaltyProgram from "../../../loyalty-program-contracts/out/LoyaltyProgram.sol/LoyaltyProgram.json"
import loyaltyGift from "../../../loyalty-program-contracts/out/LoyaltyGift.sol/LoyaltyGift.json"
import erc6551Account from "../../../loyalty-program-contracts/out/ERC6551Account.sol/ERC6551Account.json"

export const loyaltyProgramAbi: Abi = JSON.parse(JSON.stringify(loyaltyProgram.abi)) // why?! why, why, why? It is NOT possible to directly import it. 
export const loyaltyGiftAbi: Abi = JSON.parse(JSON.stringify(loyaltyGift.abi)) 
export const ERC6551AccountAbi: Abi = JSON.parse(JSON.stringify(erc6551Account.abi)) 

// export const loyaltyProgramAbi: Abi = [
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "uri",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "erc6551Registry",
//         "type": "address"
//       },
//       {
//         "internalType": "address payable",
//         "name": "erc6551Implementation",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "inputs": [],
//     "name": "ECDSAInvalidSignature",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "length",
//         "type": "uint256"
//       }
//     ],
//     "name": "ECDSAInvalidSignatureLength",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "bytes32",
//         "name": "s",
//         "type": "bytes32"
//       }
//     ],
//     "name": "ECDSAInvalidSignatureS",
//     "type": "error"
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
//     "name": "LoyaltyProgram__DoesNotOwnLoyaltyCard",
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
//         "name": "loyaltyGift",
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
//     "name": "LoyaltyProgram__LoyaltyGiftNotClaimable",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__LoyaltyGiftNotOnCard",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__LoyaltyGiftNotRecognised",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__LoyaltyTokensNotRedeemable",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__OnlyOwner",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__RequestAlreadyExecuted",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__RequestInvalid",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__TransferDenied",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "LoyaltyProgram__TransferDeniedX",
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
//         "name": "loyaltyGift",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "AddedLoyaltyGift",
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
//         "name": "loyaltyGift",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "RemovedLoyaltyGiftClaimable",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "loyaltyGift",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "RemovedLoyaltyGiftRedeemable",
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
//     "name": "LOYALTY_POINTS_ID",
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
//         "name": "loyaltyGiftAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "addLoyaltyGift",
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
//         "internalType": "string",
//         "name": "_gift",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_cost",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "loyaltyGiftsAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyCardId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "customerAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyPoints",
//         "type": "uint256"
//       },
//       {
//         "internalType": "bytes",
//         "name": "signature",
//         "type": "bytes"
//       }
//     ],
//     "name": "claimLoyaltyGift",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyCardAddress",
//         "type": "address"
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
//         "name": "loyaltyGiftAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "getLoyaltyGiftsIsClaimable",
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
//         "name": "loyaltyGiftAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "getLoyaltyGiftsIsRedeemable",
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
//         "name": "loyaltyCardAddress",
//         "type": "address"
//       }
//     ],
//     "name": "getNonceLoyaltyCard",
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
//         "internalType": "address",
//         "name": "loyaltyGiftAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "loyaltyGiftIds",
//         "type": "uint256[]"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "numberOfTokens",
//         "type": "uint256[]"
//       }
//     ],
//     "name": "mintLoyaltyVouchers",
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
//         "internalType": "string",
//         "name": "_voucher",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "loyaltyGift",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyCardId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "customerAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "bytes",
//         "name": "signature",
//         "type": "bytes"
//       }
//     ],
//     "name": "redeemLoyaltyVoucher",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyGiftAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "removeLoyaltyGiftClaimable",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyGiftAddress",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "removeLoyaltyGiftRedeemable",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "s_erc6551Implementation",
//     "outputs": [
//       {
//         "internalType": "contract ERC6551BespokeAccount",
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
//   }
// ]

// export const loyaltyGiftAbi: Abi = [
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "loyaltyTokenUri",
//         "type": "string"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "tokenised",
//         "type": "uint256[]"
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
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "mintedAt",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "redeemedFrom",
//         "type": "address"
//       }
//     ],
//     "name": "LoyaltyGift__IllegalRedeem",
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
//     "name": "LoyaltyGift__LoyaltyProgramNotRecognised",
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
//     "name": "LoyaltyGift__NftNotOwnedByloyaltyCard",
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
//     "name": "LoyaltyGift__NoTokensAvailable",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "LoyaltyGift__NotTokenised",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyTokenId",
//         "type": "uint256"
//       }
//     ],
//     "name": "LoyaltyGift__RequirementsNotMet",
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
//     "name": "LoyaltyGift__TokenNotOwnedByCard",
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
//     "name": "LoyaltyGift__TransferDenied",
//     "type": "error"
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
//         "name": "issuer",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256[]",
//         "name": "tokenised",
//         "type": "uint256[]"
//       }
//     ],
//     "name": "LoyaltyGiftDeployed",
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
//     "inputs": [],
//     "name": "getTokenised",
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
//         "internalType": "address",
//         "name": "loyaltyCard",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyPoints",
//         "type": "uint256"
//       }
//     ],
//     "name": "issueLoyaltyGift",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "success",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "loyaltyGiftIds",
//         "type": "uint256[]"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "numberOfTokens",
//         "type": "uint256[]"
//       }
//     ],
//     "name": "mintLoyaltyVouchers",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyCard",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "reclaimLoyaltyVoucher",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "success",
//         "type": "bool"
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
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "requirementsLoyaltyGiftMet",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "success",
//         "type": "bool"
//       }
//     ],
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
//   }
// ]

// export const ERC6551AccountAbi: Abi = [
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "loyaltyTokenUri",
//         "type": "string"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "tokenised",
//         "type": "uint256[]"
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
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "mintedAt",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "redeemedFrom",
//         "type": "address"
//       }
//     ],
//     "name": "LoyaltyGift__IllegalRedeem",
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
//     "name": "LoyaltyGift__LoyaltyProgramNotRecognised",
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
//     "name": "LoyaltyGift__NftNotOwnedByloyaltyCard",
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
//     "name": "LoyaltyGift__NoTokensAvailable",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "LoyaltyGift__NotTokenised",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyToken",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyTokenId",
//         "type": "uint256"
//       }
//     ],
//     "name": "LoyaltyGift__RequirementsNotMet",
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
//     "name": "LoyaltyGift__TokenNotOwnedByCard",
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
//     "name": "LoyaltyGift__TransferDenied",
//     "type": "error"
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
//         "name": "issuer",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256[]",
//         "name": "tokenised",
//         "type": "uint256[]"
//       }
//     ],
//     "name": "LoyaltyGiftDeployed",
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
//     "inputs": [],
//     "name": "getTokenised",
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
//         "internalType": "address",
//         "name": "loyaltyCard",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyPoints",
//         "type": "uint256"
//       }
//     ],
//     "name": "issueLoyaltyGift",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "success",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "loyaltyGiftIds",
//         "type": "uint256[]"
//       },
//       {
//         "internalType": "uint256[]",
//         "name": "numberOfTokens",
//         "type": "uint256[]"
//       }
//     ],
//     "name": "mintLoyaltyVouchers",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "loyaltyCard",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "loyaltyGiftId",
//         "type": "uint256"
//       }
//     ],
//     "name": "reclaimLoyaltyVoucher",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "success",
//         "type": "bool"
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
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "requirementsLoyaltyGiftMet",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "success",
//         "type": "bool"
//       }
//     ],
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
//   }
// ] 

