'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { PiCaretDown } from 'react-icons/pi'
import { PiFlowerFill } from 'react-icons/pi'

import useUser from '@/hooks/useUser'

import Profile from '../images/reddit_default_pp.png'

import Loader from './Loader'

interface UserOptionsProps {
  userName: string | null | undefined
}

const UserOptions: React.FC<UserOptionsProps> = ({ userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const { data: userData, isLoading, isError } = useUser(userName as string)

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!userData) {
    return <div>User not found</div>
  }

  const { commentKarma = 0, postKarma = 0 } = userData
  const totalKarma = Math.max(1, postKarma + commentKarma)

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState)
  }

  const handleLogOut = async () => {
    toggleMenu()
    await signOut()
    router.push('/')
  }

  return (
    <div className="relative z-50">
      <section
        className="flex h-10 w-16 flex-row items-center justify-between border-[1px] border-reddit-border px-1 text-xs duration-300 hover:cursor-pointer lg:w-52"
        onClick={toggleMenu}
      >
        <div className="flex h-10 flex-row items-center gap-x-2 px-1">
          <Image src={Profile} className="h-6 w-6" alt="profile" />
          <div className="hidden gap-y-0.5 lg:flex lg:flex-col ">
            <span> {userName} </span>
            <div className="flex flex-row items-center text-gray-300">
              <PiFlowerFill className="h-3 w-3 text-red-500" />
              <span> {totalKarma} karma </span>
            </div>
          </div>
        </div>
        <PiCaretDown />
      </section>
      <div
        className={`${isMenuOpen ? 'opacity-100' : 'pointer-events-none  opacity-0'} absolute right-0 z-50 mt-1 flex w-52 min-w-fit flex-col border border-reddit-border bg-reddit-dark transition-opacity duration-300`}
      >
        <Link
          className="p-2 duration-200 hover:cursor-pointer hover:bg-reddit-hover-gray"
          href={`/u/${userName}`}
          onClick={toggleMenu}
        >
          Profile
        </Link>
        <div className="p-2 duration-200 hover:cursor-pointer hover:bg-reddit-hover-gray" onClick={handleLogOut}>
          Sign out
        </div>
      </div>
    </div>
  )
}

export default UserOptions
