import React from 'react'
import Image from 'next/image'

export default function LoadingComp() {
  return <div className=' gap-2 justify-items-center content-center h-screen'>
  <div className='animate-bounce '> 
    <Image src="/logo.png" width={300} height={10} alt='logo' />
  </div>
</div>

}