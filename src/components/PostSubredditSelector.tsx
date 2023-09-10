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
    <main className='relative w-72 p-2 flex justify-between items-center bg-reddit-dark rounded-lg border-[1px] border-reddit-border' onClick={toggleMenu}>
      {selectedSubreddit}
      <PiCaretDown className='hover:cursor-pointer' />
      {isOpen && (
        <div className='z-10 p-2 absolute top-9 right-0 mt-2 w-72 bg-reddit-dark rounded-lg'>
          {subredditList?.map((sub, index) => (
            <div
              className='p-2 text-sm hover:cursor-pointer'
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
  // return (
  //   <div className='flex flex-col gap-y-4'>
  //     {subredditList?.map(row => (
  //       <p> {row} </p>
  //     ))}
  //   </div>
  // )
}

export default PostSubredditSelector