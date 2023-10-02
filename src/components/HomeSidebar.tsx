import React from 'react'
import Image from 'next/image'
import Banner from '../images/home_banner.png'
import Snoo from '../images/Snoo.png'
import Link from 'next/link'

const HomeSidebar = () => {
  return (
    <div className='flex flex-col border rounded-lg border-reddit-border'>
      <Image src={Banner} alt='home banner' className='w-80 h-fit' />
      <section className='flex flex-col px-2 pb-4 gap-y-2 bg-reddit-dark'>
        <div className='flex flex-row items-center gap-x-2'>
          <Image src={Snoo} alt='Snoo' className='w-12 h-20 -mt-3' />
          <span className='font-bold'> Home </span>
        </div>
        <span className='pb-2 whitespace-pre-wrap border-b border-reddit-placeholder-gray'>
          Your personal Reddit frontpage. Come here to check in with your favourite communities.
        </span>
        <section className='flex flex-col mt-2 gap-y-4'>
          <Link href='/submit' className='py-1 font-bold text-center text-black duration-300 rounded-full bg-reddit-white hover:brightness-90'>
            Create post
          </Link>
          <button className='py-1 font-bold duration-300 border rounded-full bg-reddit-gray text-reddit-white border-reddit-white hover:brightness-110'>
            Create community
          </button>
        </section>
      </section>
    </div>
  )
}

export default HomeSidebar