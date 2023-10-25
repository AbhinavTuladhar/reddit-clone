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
    setIsOpen(prevState => !prevState)
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
      className='z-50 relative h-10 w-10 lg:w-64 px-1 flex flex-row gap-x-2 lg:justify-between items-center border-[1px] border-transparent hover:cursor-pointer hover:border-reddit-border duration-300'
      onClick={toggleMenu}>
      <div className='flex flex-row items-center justify-between w-16 gap-x-2 lg:w-64'>
        <div className='flex flex-row items-center gap-x-2'>
          {selectedSub === 'Home' ? (
            <>
              <AiFillHome className='hidden w-6 h-6 text-white lg:block' height={60} width={60} />
              <span className='hidden text-sm lg:block'>
                Home
              </span>
            </>
          ) : (
            <span className='hidden text-sm lg:block'> {selectedSub}</span>
          )}
        </div>
        <PiCaretDown />

        {isOpen && (
          <ul className='absolute left-0 z-40 flex flex-col w-64 mt-2 overflow-y-auto list-none border rounded-lg top-9 bg-reddit-dark border-slate-300 max-h-64'>
            {subredditList?.map((sub, index) => (
              <li
                className='z-50 p-2 text-sm border border-slate-300 hover:brightness-110 hover:cursor-pointer'
                key={index}>
                <Link href={`/r/${sub.slice(2)}`}>
                  {sub}
                </Link>
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