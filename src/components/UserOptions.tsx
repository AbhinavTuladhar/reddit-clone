'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import useSWR from 'swr';
import { UserType } from '@/types/types'
import { signOut } from 'next-auth/react'
import { PiCaretDown } from 'react-icons/pi'
import { PiFlowerFill } from 'react-icons/pi'
import Profile from '../images/reddit_default_pp.png'

interface UserOptionsProps {
  userName: string | null | undefined
}

const UserOptions: React.FC<UserOptionsProps> = ({ userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const fetcher = (url: string) => axios.get(url).then(response => response.data)
  const { data: userData } = useSWR<UserType>(`/api/u/${userName}`, fetcher)

  const { commentKarma = 0, postKarma = 0 } = userData || {}
  const totalKarma = Math.max(1, postKarma + commentKarma)

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  return (
    <div className='relative z-50'>
      <section
        className='h-10 w-16 lg:w-52 flex flex-row justify-between items-center text-xs border-[1px] hover:cursor-pointer border-reddit-border duration-300 px-1'
        onClick={toggleMenu}
      >
        <div className='flex flex-row items-center h-10 px-1 gap-x-2'>
          <Image src={Profile} className='w-6 h-6' alt='profile' />
          <div className='hidden lg:flex lg:flex-col gap-y-0.5 '>
            <span> {userName} </span>
            <div className='flex flex-row items-center text-gray-300'>
              <PiFlowerFill className='w-3 h-3 text-red-500' />
              <span> {totalKarma} karma </span>
            </div>
          </div>
        </div>
        <PiCaretDown />
      </section>
      <div className={`${isMenuOpen ? 'opacity-100' : 'opacity-0  pointer-events-none'} transition-opacity duration-300 absolute right-0 z-50 flex flex-col mt-1 border min-w-fit w-52 bg-reddit-dark border-reddit-border`}>
        <Link className='p-2 duration-200 hover:bg-reddit-hover-gray hover:cursor-pointer' href={`/u/${userName}`} onClick={toggleMenu}> Profile </Link>
        <div className='p-2 duration-200 hover:bg-reddit-hover-gray hover:cursor-pointer' onClick={() => { signOut(); toggleMenu() }}> Sign out </div>
      </div>
    </div>
  )
}

export default UserOptions