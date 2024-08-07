import { JSXElementConstructor } from "react";
import { CreateContractEventFilterParameters } from "viem";

export interface getContractEventsProps extends CreateContractEventFilterParameters {
  args?: any; 
}

export interface UserInputState  {
  modalVisible: bool, 
  settings: {
    darkMode: bool, 
    developerMode: bool 
  }
}

export type EthAddress = `0x${string}`; // or: Hex

export type ScreenDimensions = {
  width: number,
  height: number
}

export interface SearchParams {
  prog: EthAddress
}

export type DeployedContractLog = {
  address: EthAddress; 
  blockHash: string;
}

export type Notification = {
  id: string;
  // message?: JSXElementConstructor;
  message?: string;
  loginButton?: boolean; 
  colour?: "red" | "yellow" | "green" | "gray" | "invisible"
  durationInMs?: number | "noTimer";
  progressInPercent?: number | "noProgress";
  isVisible?: boolean; 
}

export type Attribute = {  
  trait_type: string | number ;  
  value: string;
}

export type Metadata = {
  name: string; 
  description: string; 
  imageUri: string;
  attributes: Attribute[]
}

export type LoyaltyProgram = {
  programAddress: EthAddress; 
  uri?: string; 
  metadata?: Metadata;
  programOwner?: EthAddress;
  balances?: number[] | undefined;
} 

export type LoyaltyCard = {
  cardId: Number; 
  cardAddress?: EthAddress; 
  userAddress?: EthAddress; 
  loyaltyProgramAddress?: EthAddress; 
  balance?: number | undefined; 
}

// for now type for program and token are the same - but might change in the future 
export type LoyaltyGift = {
  giftAddress: EthAddress; 
  giftId: number; 
  version?: string;
  uri?: string ;
  metadata?: Metadata ;
  issuer?: EthAddress; 
  isClaimable?: number;
  isVoucher?: number; 
  cost?: number; 
  hasAdditionalRequirements?: number; 
  availableVouchers?: number;  
} 

export type QrData = undefined | {
  type: "giftPoints" | "redeemToken" | "requestCard" | "claimGift"; 
  loyaltyProgram?: EthAddress; 
  loyaltyCardAddress?: EthAddress; 
  loyaltyCardId?: number; 
  loyaltyToken?: EthAddress; 
  loyaltyTokenId?: number; 
  customerAddress?: EthAddress;
  loyaltyPoints?: number; 
  signature?: Hex; 
} 

export type Transaction = {
  address: EthAddress;
  blockNumber: BigInt;
  logIndex: number; 
  operator: EthAddress; 
  from: EthAddress; 
  to: EthAddress; 
  ids: BigInt[]; 
  values: BigInt[]; 
  blockData?: Any
}

export type TransactionArgs = UnionOmit<Transaction, 'blockNumber' | 'logIndex'>;

export type Status = "isIdle" | "isLoading" | "isError" | "isSuccess" 
 
