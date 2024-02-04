// NB! BEFORE publishing this project, I need to actually copy-paste bytecode. This setup is for dev only.  

import { Hex, ToBytesParameters, isHex } from "viem"
import loyaltyProgram from "../../../loyalty-program-contracts/out/LoyaltyProgram.sol/LoyaltyProgram.json"
import { parseHex } from "@/app/utils/parsers"

export const loyaltyProgramBytecode: Hex = parseHex(loyaltyProgram.bytecode.object) 