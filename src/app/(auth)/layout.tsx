import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

function AuthLayout({children}: {children: ReactNode}) {
  return (
    <div className='flex h-[100vh] justify-center items-center w-full'>
      <div className='p-5 w-full'>
        {children}
      </div>
      <div className='max-sm:hidden h-full w-full bg-contain bg-[url(/medical-bg.jpg)]'>
        <div className='flex justify-center items-center h-full w-full'>
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center space-x-2 rounded-full border min-h-[200px] min-w-[200px] bg-white/30 backdrop-blur-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full">
              <Image src="/logo/logo.png" width={50} height={50} alt='' className="size-8" />
            </div>
            <span className=" bg-gradient-to-r from-blue-600 via-white to-indigo-400 inline-block text-transparent bg-clip-text text-3xl font-bold">WeCare</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
