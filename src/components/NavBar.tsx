'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiReddit } from 'react-icons/si'
import { signOut, useSession } from 'next-auth/react'
import Subreddit from './Subreddit'
import Searchbar from './Searchbar'
import IconGroup from './IconGroup'
import ModalContainer from './ModalContainer'
import LoginWindow from './LoginWindow'
import SignupWindow from './SignupWindow'
import UserOptions from './UserOptions'
import { ModalStateType } from '@/types/types'

const NavBar = () => {
  const session = useSession()
  const router = useRouter()
  const { status } = session
  // console.log(session)

  const [modalState, setModalState] = useState<ModalStateType>('closed')

  const handleLogOut = async () => {
    const data = await signOut({ callbackUrl: '/', redirect: false })
    router.push(data.url)
  }

  return (
    <nav className='bg-reddit-dark px-5 h-12 flex flex-row justify-between gap-x-2 items-center border-b-[1px] border-reddit-border top-0 fixed w-full'>
      <Link className='flex flex-row items-center gap-x-2' href='/'>
        <SiReddit className='bg-white text-reddit-orange h-8 w-8 rounded-full' />
        <h1 className='text-white text-xl hidden lg:block'> reddit </h1>
      </Link>
      <Subreddit />
      <Searchbar />
      {status === 'authenticated' && <IconGroup />}
      {status === 'authenticated' && session && (
        <UserOptions userName={session?.data?.user?.name} />
      )}
      {status === 'unauthenticated'
        ? (
          <div className='flex flex-row gap-x-4'>
            <button
              className='bg-reddit-orange p-2 rounded-3xl hover:brightness-50 text-white whitespace-nowrap'
              onClick={() => setModalState('login')}
            > Log In </button>
            <button
              className='text-reddit-orange p-2 rounded-3xl hover:brightness-50 bg-white whitespace-nowrap'
              onClick={() => setModalState('signup')}
            > Sign up </button>
          </div>
        ) : status === 'authenticated'
          ? (
            <button
              onClick={handleLogOut}
              className='bg-reddit-orange p-2'
            > Logout </button>
          ) : (
            <div> Loading... </div>
          )
      }
      <ModalContainer visibilityFlag={modalState === 'login'}>
        <LoginWindow modalState={modalState} setModalState={setModalState} />
      </ModalContainer>
      <ModalContainer visibilityFlag={modalState === 'signup'}>
        <SignupWindow modalState={modalState} setModalState={setModalState} />
      </ModalContainer>
    </nav>
  )
}

export default NavBar