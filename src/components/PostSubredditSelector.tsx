'use client'

import React, { useState } from 'react'
import { PiCaretDown } from 'react-icons/pi'

interface SubSelectorProps {
  subredditList: string[] | undefined
  selectedSubreddit: string
  setSelectedSubreddit: (sub: string) => void
}

const PostSubredditSelector: React.FC<SubSelectorProps> = ({
  subredditList,
  selectedSubreddit,
  setSelectedSubreddit,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState)
  }

  return (
    <main
      className="relative z-10 flex w-72 items-center justify-between rounded-lg border-[1px] border-reddit-border bg-reddit-dark p-2"
      onClick={toggleMenu}
    >
      {selectedSubreddit}
      <PiCaretDown className="hover:cursor-pointer" />
      {isOpen && (
        <div className="absolute right-0 top-9 mt-2 max-h-64 w-72 overflow-y-auto rounded-lg border border-slate-300 bg-reddit-dark">
          {subredditList?.map((sub, index) => (
            <div
              className="relative z-50 border border-slate-300 p-2 text-sm hover:cursor-pointer hover:brightness-110"
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
