"use client"; 

import { InputForm } from "../../components/InputForm"
import { SectionTitle } from "@/app/ui/SectionTitle";


export default function Page() {

  return (
    <div className="h-full w-full grid justify-items-center place-content-center"> 
      <div className="h-full w-full grid grid-cols-1 gap-2 divide-y-2 place-content-center" > 
        <div className="h-full grid grid-cols-1 gap-1 place-items-center max-h-72">
            <SectionTitle size = "lg" title = "Loyalty Points Remaining" /> 
            <InputForm type = "points" presetAmounts = {["5000", "25000", "500000"]} /> 
        </div> 

        <div className="h-full grid grid-cols-1 gap-1 place-items-center max-h-72">
            <SectionTitle size = "lg" title = "Loyalty Cards Remaining" /> 
            <InputForm type = "points" presetAmounts = {["5", "25", "100"]} /> 
        </div> 

      </div>
    </div>

        
  );
}
