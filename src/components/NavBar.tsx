import React from 'react'
import Link from 'next/link'
import { SiReddit } from 'react-icons/si'
import Subreddit from './Subreddit'
import Searchbar from './Searchbar'
import IconGroup from './IconGroup'

const NavBar = () => {
  return (
    <nav className='bg-reddit-dark px-5 h-12 flex flex-row items-center gap-x-5 border-b-[1px] border-reddit-border'>
      <Link className='flex flex-row items-center gap-x-2' href='/'>
        <SiReddit className='bg-white text-reddit-orange h-8 w-8 rounded-full' />
        <h1 className='text-white text-xl hidden md:block'> reddit </h1>
      </Link>
      <Subreddit />
      <Searchbar />
      <IconGroup />
    </nav>
  )
}

export default NavBar