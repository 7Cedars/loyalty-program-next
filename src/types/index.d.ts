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

export type DeployedLoyaltyProgramLog = {
  address: EthAddress; 
  blockHash: string;
}

export type Notification = {
  id: string;
  // message?: JSXElementConstructor;
  message?: string;
  linkText?: string; 
  linkHref?: string; 
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

export type LoyaltyProgramMetadata = {
  tokenAddress: EthAddress; 
  uri: string; 
  metadata: TokenMetadata 
  status?: "loading" | "error" | "success"
} 
