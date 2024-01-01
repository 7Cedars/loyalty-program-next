import { useState } from "react";
import { LoyaltyProgram } from "@/types";

export const useLoyaltyProgram = () => {

  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>();

  return {loyaltyProgram, setLoyaltyProgram};
}
