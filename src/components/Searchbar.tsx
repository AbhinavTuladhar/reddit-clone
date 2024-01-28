import React from 'react'
import { PiMagnifyingGlassLight } from 'react-icons/pi'

const Searchbar = () => {
  return (
    <div className="flex h-10 w-5/6 flex-row items-center gap-x-2 overflow-x-hidden whitespace-nowrap rounded-full border-[1px] border-reddit-border bg-reddit-gray px-3 hover:cursor-text hover:border-slate-200 hover:bg-transparent sm:w-5/6 md:w-5/6 lg:w-96">
      <PiMagnifyingGlassLight className="h-6 w-6 font-bold text-reddit-placeholder-gray" />
      <span className="text-sm text-reddit-placeholder-gray">Search Reddit</span>
    </div>
  )
}

export default Searchbar
