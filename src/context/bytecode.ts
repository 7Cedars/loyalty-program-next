// NB! BEFORE publishing this project, I need to actually copy-paste bytecode. This setup is for dev only.  

import { Hex } from "viem"
import loyaltyProgram from "../../../loyalty-program-contracts/out/LoyaltyProgram.sol/LoyaltyProgram.json"

export const loyaltyProgramBytecode: Hex = JSON.parse(JSON.stringify(loyaltyProgram.bytecode)) // why?! why, why, why? It is NOT possible to directly import it. 