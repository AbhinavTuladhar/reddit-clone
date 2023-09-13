'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AiFillHome } from 'react-icons/ai'
import { PiCaretDown } from 'react-icons/pi'
import useSWR from 'swr'
import Select from 'react-select'

interface SubListResponse {
  name: string,
  creatorName: string
}

interface SubredditProps {
  subredditList: string[] | undefined
}

const Subreddit: React.FC<SubredditProps> = ({ subredditList }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(prevState => !prevState)
  }

  return (
    <section
      className='z-50 relative h-10 w-16 lg:w-64 px-1 flex flex-row gap-x-2 lg:justify-between items-center border-[1px] border-transparent hover:cursor-pointer hover:border-reddit-border duration-300'
      onClick={toggleMenu}>
      <div className='flex flex-row items-center justify-between gap-x-2 w-16 lg:w-64'>
        <div className='flex flex-row items-center gap-x-2'>
          <AiFillHome className='text-white w-6 h-6' height={60} width={60} />
          <span className='text-sm hidden lg:block'>
            Home
          </span>
        </div>
        <PiCaretDown />
        {isOpen && (
          <ul className='flex flex-col list-none z-40 absolute top-9 left-0 mt-2 w-64 bg-reddit-dark rounded-lg border border-slate-300 max-h-64 overflow-y-auto'>
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
        {/* <span className='text-sm hidden lg:block'>
          Home
        </span> */}
      </div>
    </section>
  )
}

export default Subreddit