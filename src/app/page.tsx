"use client"

import Link from 'next/link'


export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
        <div className='flex flex-col divide-y divide-gray-600  max-w-screen-lg  w-full justify-center'> 
          <div className='p-2 text-center text-gray-600 hover:text-gray-900'> 
            <Link href='/customer'>Go to customer website </Link>
          </div>
          <div className='p-2 text-center text-gray-600 hover:text-gray-900'>
            <Link href='/vendor'>Go to vendor website </Link>
          </div>
        </div>
    </main>
  )
}
