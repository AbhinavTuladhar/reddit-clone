import React from 'react'
import { AiFillHome } from 'react-icons/ai'
import { PiCaretDown } from 'react-icons/pi'

const Subreddit = () => {
  return (
    <div className='h-10 w-16 lg:w-64 px-1 flex flex-row gap-x-2 lg:justify-between items-center border-[1px] border-transparent hover:cursor-pointer hover:border-reddit-border duration-300'>
      <div className='flex flex-row items-center gap-x-2'>
        <AiFillHome className='text-white w-6 h-6' height={60} width={60} />
        <span className='text-sm hidden lg:block'>
          Home
        </span>
      </div>
      <PiCaretDown />
    </div>
  )
}

export default Subreddit