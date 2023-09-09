import React from 'react'
import Image from 'next/image'
import Profile from '../images/reddit_default_pp.png'
import { PiCaretDown } from 'react-icons/pi'

interface UserOptionsProps {
  userName: string | null | undefined
}

const UserOptions: React.FC<UserOptionsProps> = ({ userName }) => {
  return (
    <section className='h-10 flex flex-row justify-between items-center text-xs w-52 border-[1px] border-transparent hover:cursor-pointer hover:border-reddit-border duration-300'>
      <div className='h-10 flex flex-row items-center gap-x-2 px-1'>
        <Image src={Profile} className='h-6 w-6' alt='profile' />
        <div className='flex flex-col gap-y-0.5'>
          <span> {userName} </span>
          <span> 1 Karma </span>
        </div>
      </div>
      <PiCaretDown />
    </section>
  )
}

export default UserOptions