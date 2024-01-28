'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AiFillHome } from 'react-icons/ai'
import { PiCaretDown } from 'react-icons/pi'

interface SubredditProps {
  subredditList: string[] | undefined
}

const Subreddit: React.FC<SubredditProps> = ({ subredditList }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSub, setSelectedSub] = useState('Home')
  const currentPath = usePathname()

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState)
  }

  // For finding out what to display in the div
  useEffect(() => {
    // Converts '/r/politics' and '/r/politics/comments/sdfjjskldjf to ['r', 'politics'] and '/' to ['']
    const elements = currentPath.split('/').slice(1, 3)
    if (elements[0] === '') {
      setSelectedSub('Home')
    } else {
      setSelectedSub(elements.join('/'))
    }
  }, [currentPath])

  return (
    <section
      className="relative z-50 flex h-10 w-10 flex-row items-center gap-x-2 border-[1px] border-transparent px-1 duration-300 hover:cursor-pointer hover:border-reddit-border lg:w-64 lg:justify-between"
      onClick={toggleMenu}
    >
      <div className="flex w-16 flex-row items-center justify-between gap-x-2 lg:w-64">
        <div className="flex flex-row items-center gap-x-2">
          {selectedSub === 'Home' ? (
            <>
              <AiFillHome className="hidden h-6 w-6 text-white lg:block" height={60} width={60} />
              <span className="hidden text-sm lg:block">Home</span>
            </>
          ) : (
            <span className="hidden text-sm lg:block"> {selectedSub}</span>
          )}
        </div>
        <PiCaretDown />

        {isOpen && (
          <ul className="absolute left-0 top-9 z-40 mt-2 flex max-h-64 w-64 list-none flex-col overflow-y-auto rounded-lg border border-slate-300 bg-reddit-dark">
            {subredditList?.map((sub, index) => (
              <li
                className="z-50 border border-slate-300 p-2 text-sm hover:cursor-pointer hover:brightness-110"
                key={index}
              >
                <Link href={`/r/${sub.slice(2)}`}>{sub}</Link>
              </li>
            ))}
          </ul>
        )}

        {/* <span className='hidden text-sm lg:block'>
          Home
        </span> */}
      </div>
    </section>
  )
}

export default Subreddit
