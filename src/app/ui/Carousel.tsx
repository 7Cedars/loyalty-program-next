"use client"

// See here for useful example: https://robkendal.co.uk/blog/how-to-build-a-multi-image-carousel-in-react-and-tailwind/
// This is a completely revised (and simplified version) of the carousel set out in link above. 
// implement first in landing page - then rest of app. 

import { useState, useRef, useEffect } from 'react';
import data from "../../../public/exampleLoyaltyPrograms.json"; // not that this is a very basic json file data format - can be used in many other cases as well. 
import Image from 'next/image';
import { TitleText } from './StandardisedFonts';
import { LoyaltyProgram } from '@/types';
import { Button } from './Button';

export const Carousel = () => {
  const [ selectIndex, setSelectedIndex ] = useState<number | undefined>(1);
  const [ loyaltyPrograms, setLoyaltyPrograms ] = useState<LoyaltyProgram[]>() // this needs to be the input. 
  // const carousel = useRef<HTMLDivElement>(null);  // this ref to HTMLDivElement thing is brilliant! 

  return (
    <div className="relative my-6 mx-auto">
        <div className="flex flex-row justify-between overflow-x-auto overflow-hidden scroll-px-1 snap-normal w-full h-full">
          
          {data.items.map((item) => 
          
              <div
                key={item.index}
                className="carousel-item text-center snap-start ml-4 flex flex-col self-center w-full">
                  <>
                    <button 
                      className="w-48 z-0 enabled:opacity-50 enabled:w-44 transition-all ease-in-out delay-250"
                      onClick={() => setSelectedIndex(item.index)}
                      disabled={ item.index==selectIndex }
                    >
                      <Image
                        src={item.imageUrl || ''}
                        alt={item.title}
                        style = {{ objectFit: "cover" }} 
                        width={400}
                        height={600}
                        className="w-full"
                      />
                    </button>

                    { item.index==selectIndex  ? 

                      <div className='h-fit w-48 flex transition ease-in-out delay-150"'>
                        <Button appearance='grayEmpty' onClick={()=> {}}  disabled={ item.index==selectIndex }> 
                          Deploy 
                        </Button>
                      </div>
                      :
                      <div className='h-fit w-48 flex opacity-0 transition ease-in-out duration-700"'>
                        <Button appearance='grayEmpty' onClick={()=> {}}  disabled={ item.index==selectIndex }> 
                          Deploy 
                        </Button>
                      </div>
                    }
                    </>
              </div>        
            )
          }
    </div>

    <div className='text-center m-3 text-slate-700'>

      {selectIndex && data ? 
        data.items[selectIndex - 1].description
        : 
        null
      }

    </div> 
  </div>
)}
