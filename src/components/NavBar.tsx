import React from 'react'
import { SiReddit } from 'react-icons/si'
import Subreddit from './Subreddit'

const NavBar = () => {
  return (
    <nav className='bg-reddit-dark px-5 h-12 flex flex-row items-center gap-x-5 border-b-[1px] border-reddit-border'>
      <div className='flex flex-row items-center gap-x-2'>
        <SiReddit className='bg-white text-reddit-orange h-8 w-8 rounded-full' />
        <h1 className='text-white text-xl'> reddit </h1>
      </div>
      <Subreddit />
    </nav>
  )
}

export default NavBar