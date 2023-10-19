'use client'

import React, { useState } from 'react'
import { PiCaretDown } from 'react-icons/pi'

interface SubSelectorProps {
  subredditList: string[] | undefined,
  selectedSubreddit: string
  setSelectedSubreddit: (sub: string) => void,
}

const PostSubredditSelector: React.FC<SubSelectorProps> = ({
  subredditList,
  selectedSubreddit,
  setSelectedSubreddit
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(prevState => !prevState)
  }

  return (
    <main className='z-10 relative w-72 p-2 flex justify-between items-center bg-reddit-dark rounded-lg border-[1px] border-reddit-border' onClick={toggleMenu}>
      {selectedSubreddit}
      <PiCaretDown className='hover:cursor-pointer' />
      {isOpen && (
        <div className='absolute right-0 mt-2 overflow-y-auto border rounded-lg top-9 w-72 bg-reddit-dark border-slate-300 max-h-64'>
          {subredditList?.map((sub, index) => (
            <div
              className='relative z-50 p-2 text-sm border border-slate-300 hover:brightness-110 hover:cursor-pointer'
              onClick={() => setSelectedSubreddit(sub)}
              key={index}
            >
              {sub}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default PostSubredditSelector