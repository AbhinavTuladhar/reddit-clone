import React from 'react'
import { AiFillHome } from 'react-icons/ai'

const Subreddit = () => {
  return (
    <div className='h-8 w-64 px-1 flex flex-row justify-between items-center border-[1px] border-transparent hover:cursor-pointer hover:border-reddit-border duration-300'>
      <div className='flex flex-row items-center gap-x-4'>
        <AiFillHome className='text-white' height={10} />
        <span> Home </span>
      </div>
      <span>
        v
      </span>
    </div>
  )
}

export default Subreddit