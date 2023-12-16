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

export type EthAddress = `0x${string}`; 

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
  trait_type: string; 
  value: string;
}

export type TokenMetadata = {
  name: string; 
  description: string; 
  imageUri: string;
  attributes: Attribute[]
}

export type LoyaltyProgram = {
  tokenAddress: EthAddress; 
  uri: string; 
  metadata: TokenMetadata 
} 

// for now type for program and token are the same - but might change in the future 
export type LoyaltyToken = {
  tokenAddress: EthAddress; 
  uri: string; 
  metadata: TokenMetadata 
} 

export type QrData = {
  type: "giftPoints" | "redeemToken" | "requestCard"; 
  loyaltyProgram: EthAddress; 
  loyaltyCardId?: number; 
  loyaltyToken?: EthAddress; 
  loyaltyTokenId?: number; 
  customerAddress?: EthAddress;
} 