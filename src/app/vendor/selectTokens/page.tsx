"use client"; 


export default function Page() {

  return (    
    <div className="h-screen w-full flex flex-row space-x-0 border-2 border-red-800">
      <div className='mt-20 w-96 space-y-0 pt-4 grid grid-cols-1 ps-12 '> 
        One
      </div>
      
      <div className='mt-20 flex-grow space-y-0 pt-4 grid grid-cols-1 pe-12'> 
        Two
      </div> 
    </div> 
  );
}
