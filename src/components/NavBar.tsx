'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiReddit } from 'react-icons/si'
import { signOut, useSession } from 'next-auth/react'
import Subreddit from './Subreddit'
import Searchbar from './Searchbar'
import IconGroup from './IconGroup'
import ModalWrapper from '@/hoc/ModalWrapper'
import LoginWindow from './LoginWindow'
import SignupWindow from './SignupWindow'
import UserOptions from './UserOptions'
import { ModalStateType } from '@/types/types'

const NavBar = () => {
  const session = useSession()
  const router = useRouter()
  const { status } = session
  console.log(session)

  const [modalState, setModalState] = useState<ModalStateType>('closed')

  const handleLogOut = () => {
    signOut()
    router.push('/')
  }

  return (
    <nav className='bg-reddit-dark px-5 h-12 flex flex-row justify-between gap-x-5 items-center border-b-[1px] border-reddit-border top-0 fixed w-full'>
      {/* <div className={`flex flex-row items-center gap-x-7 ${status === 'authenticated' ? '' : 'justify-between'}`}> */}
      <Link className='flex flex-row items-center gap-x-2' href='/'>
        <SiReddit className='bg-white text-reddit-orange h-8 w-8 rounded-full' />
        <h1 className='text-white text-xl hidden lg:block'> reddit </h1>
      </Link>
      <Subreddit />
      <Searchbar />
      {/* </div> */}
      {status === 'authenticated' && <IconGroup />}
      {status === 'authenticated' && session && (
        // <div className='w-28 rounded-full px-4 py-2 bg-reddit-gray flex justify-center items-center'>
        //   {session.data.user?.name}
        // </div>
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
      {/* {modalState === 'login' && (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75'>
          <section className='h-[95%] my-2 w-[25rem] flex flex-col justify-center items-center mx-auto relative bg-reddit-dark text-white rounded-xl'>
            <section className={`w-3/4 mx-auto`}>
              <LoginWindow modalState={modalState} setModalState={setModalState} />
            </section>
          </section>
        </div>
      )} */}
      <ModalWrapper visibilityFlag={modalState === 'login'}>
        <LoginWindow modalState={modalState} setModalState={setModalState} />
      </ModalWrapper>
      <ModalWrapper visibilityFlag={modalState === 'signup'}>
        <SignupWindow modalState={modalState} setModalState={setModalState} />
      </ModalWrapper>
    </nav>
  )
}

export default NavBar