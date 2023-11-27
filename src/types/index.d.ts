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

export type ProgramMetadata = {
  description: string; 
  image: string; 
  vendorName: string; 
  vendorAddress: string; 
  vendorPhone?: string;
}
