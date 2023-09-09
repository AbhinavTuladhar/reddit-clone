'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Profile from '../images/reddit_default_pp.png'
import KarmaIcon from '../images/karma_icon.png'
import { PiCaretDown } from 'react-icons/pi'
import axios from 'axios'

interface UserOptionsProps {
  userName: string | null | undefined
}

const UserOptions: React.FC<UserOptionsProps> = ({ userName }) => {
  const [totalKarma, setTotalKarma] = useState<number | null>(0)

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url)
      const userData = response.data
      const { postKarma, commentKarma } = userData
      setTotalKarma(Math.max(1, postKarma + commentKarma))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData(`/api/u/${userName}`)
  }, [userName])

  return (
    <section className='h-10 w-20 min-w-fit lg:w-52 flex flex-row justify-between items-center text-xs border-[1px] border-transparent hover:cursor-pointer hover:border-reddit-border duration-300'>
      <div className='h-10 flex flex-row items-center gap-x-2 px-1'>
        <Image src={Profile} className='h-6 w-6' alt='profile' />
        <div className='hidden lg:flex lg:flex-col gap-y-0.5 '>
          <span> {userName} </span>
          <div className='flex flex-row items-center text-gray-300'>
            <Image src={KarmaIcon} className='h-4 w-4' alt='karma' />
            <span> {totalKarma} karma </span>
          </div>
        </div>
      </div>
      <PiCaretDown />
    </section>
  )
}

export default UserOptions