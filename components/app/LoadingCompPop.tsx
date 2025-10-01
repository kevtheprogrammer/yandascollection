import React from 'react'
import Image from 'next/image'

export default function LoadingCompPop() {
  return <div className=' gap-2 w-full justify-items-center   mt-36 h-screen'>
  <div className='animate-ping  '> 
    <Image src="/logo.png" width={300} height={10} alt='logo' />
  </div>
</div>

}