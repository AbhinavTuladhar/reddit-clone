import React from 'react'
import { PiMagnifyingGlassLight } from 'react-icons/pi'

const Searchbar = () => {
  return (
    <div className='w-96 h-10 px-3 bg-reddit-gray rounded-full border-[1px] border-reddit-border flex flex-row gap-x-2 items-center hover:border-slate-200 hover:cursor-text hover:bg-transparent'>
      <PiMagnifyingGlassLight className='text-reddit-placeholder-gray font-bold h-6 w-6' />
      <span className='text-reddit-placeholder-gray text-sm'>
        Search Reddit
      </span>
    </div>
  )
}

export default Searchbar