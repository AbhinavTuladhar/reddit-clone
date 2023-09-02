import React from 'react'
import { PiMagnifyingGlassLight } from 'react-icons/pi'

const Searchbar = () => {
  return (
    <div className='w-96 h-10 px-2 bg-reddit-gray rounded-full border-[1px] border-reddit-border flex flex-row gap-x-2 items-center hover:border-slate-200 hover:cursor-text'>
      <PiMagnifyingGlassLight className='text-reddit-border' />
      <span className='text-reddit-border'>
        Search Reddit
      </span>
    </div>
  )
}

export default Searchbar