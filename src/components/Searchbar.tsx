import React from 'react'
import { PiMagnifyingGlassLight } from 'react-icons/pi'

const Searchbar = () => {
  return (
    <div className='w-5/6 sm:w-5/6 md:w-5/6 lg:w-96 h-10 px-3 bg-reddit-gray rounded-full border-[1px] border-reddit-border flex flex-row gap-x-2 items-center hover:border-slate-200 hover:cursor-text hover:bg-transparent whitespace-nowrap overflow-x-hidden'>
      <PiMagnifyingGlassLight className='w-6 h-6 font-bold text-reddit-placeholder-gray' />
      <span className='text-sm text-reddit-placeholder-gray'>
        Search Reddit
      </span>
    </div>
  )
}

export default Searchbar