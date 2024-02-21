"use client";

import { LoyaltyProgram} from "@/types";
import { TitleText } from "../../ui/StandardisedFonts";
import { useEffect} from "react";
import Image from "next/image";
import { useDispatch } from 'react-redux';
import { selectLoyaltyProgram } from '@/redux/reducers/loyaltyProgramReducer';
import { useLoyaltyPrograms } from '@/app/hooks/useLoyaltyPrograms';

export default function ChooseProgram()  {
  const { status, loyaltyPrograms, fetchPrograms } = useLoyaltyPrograms()
  const dispatch = useDispatch() 

  useEffect(() => {
    if (!loyaltyPrograms) fetchPrograms()
  }, [, loyaltyPrograms ]) 

  useEffect(() => {
    if (
      status == "isSuccess" && 
      loyaltyPrograms && 
      loyaltyPrograms.length == 1 && 
      loyaltyPrograms.findIndex(loyaltyProgram => loyaltyProgram.metadata) !== -1
      ) 
      dispatch(selectLoyaltyProgram(loyaltyPrograms[0]))
  }, [status, loyaltyPrograms])

  return (
     <div className='w-full h-full flex flex-col items-center justify-center' >
      <div> 
      <TitleText title = "Choose Loyalty Program" subtitle="Choose existing program or deploy a new one." size={1} /> 
      </div> 
       { status == "isSuccess" && loyaltyPrograms && loyaltyPrograms.length > 0 ? 
        <div className="relative my-6 mx-4 flex flex-col justify-center sm:w-4/5 w-full h-full">
            <div className="flex flex-row justify-between overflow-x-auto overflow-hidden scroll-px-1 snap-normal w-full h-full self-center">

            { loyaltyPrograms.map(program =>  
            <div
              key={program.programAddress}
              className="carousel-item h-96 w-52 text-center items-center snap-start ml-4 flex flex-col self-center">
              <button 
                onClick = {() =>  dispatch(selectLoyaltyProgram(program))}
                  className="w-11/12 z-0 h-96 w-52 max-h-80 max-w-48 self-center m-1"> 
                      <Image
                        className="h-90 w-48 self-center rounded-lg" 
                        width={400}
                        height={600}
                        style = {{ objectFit: "cover" }} 
                        src={program.metadata? program.metadata.imageUri : `/images/loading2.svg`}
                        alt="Loyalty Program Card"
                      />
                </button>
              </div>
            )}
            </div>
          </div>
          : 
          status == "isLoading" ? 
            <div className="grow flex flex-col self-center items-center justify-center">
              <Image
                className="rounded-lg flex-none mx-3 animate-spin self-center"
                width={60}
                height={60}
                src={"/images/loading2.svg"}
                alt="Loading icon"
              />
            </div>
          :
          <div className='w-full h-full grow grid grid-cols-1 gap-1 justify-items-center text-center italic' >
          <div className='h-48'>
              <div >
                No Loyalty Programs found on this address. 
              </div> 
              <div >
                Login with another address or deploy a program <a href="/" className='text-blue-500 underline '> here. </a>
              </div> 
            </div> 
          </div>
      } 

      </div>
    ) 
} 