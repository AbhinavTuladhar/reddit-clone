'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiReddit } from 'react-icons/si'
import { signIn, signOut, useSession } from 'next-auth/react'
import Subreddit from './Subreddit'
import Searchbar from './Searchbar'
import IconGroup from './IconGroup'

type ModalStateType = 'closed' | 'login' | 'signup'

const NavBar = () => {
  const session = useSession()
  const { status } = session
  console.log(session)

  const [modalState, setModalState] = useState<ModalStateType>('closed')

  const modalParentClassName = 'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75'
  const modalChild1ClassName = 'h-[95%] my-2 w-4/12 flex flex-cols justify-center items-center mx-auto relative bg-white rounded-xl'

  useEffect(() => {
    console.log(modalState)
  }, [modalState])

  const loginWindow = (
    <div className={`${modalState === 'login' ? modalParentClassName : 'hidden'}`}>
      <div className={modalChild1ClassName}>
        <p> This is the login window </p>
        <button className='bg-purple-400 p-2' onClick={() => setModalState('closed')}> Close window </button>
      </div>
    </div>
  )

  const signUpWindow = (
    <div className={`${modalState === 'signup' ? modalParentClassName : 'hidden'}`}>
      <div className={modalChild1ClassName}>
        <p className='text-black'> This is the signup window </p>
        <button className='bg-purple-400 p-2' onClick={() => setModalState('closed')}> Close window </button>
      </div>
    </div>
  )

  return (
    <nav className='bg-reddit-dark px-5 h-12 flex flex-row justify-between gap-x-5 items-center border-b-[1px] border-reddit-border top-0 fixed w-full'>
      <div className={`flex flex-row items-center gap-x-7 ${status === 'authenticated' ? '' : 'justify-between'}`}>
        <Link className='flex flex-row items-center gap-x-2' href='/'>
          <SiReddit className='bg-white text-reddit-orange h-8 w-8 rounded-full' />
          <h1 className='text-white text-xl hidden md:block'> reddit </h1>
        </Link>
        <Subreddit />
        <Searchbar />
      </div>
      {status === 'authenticated' && <IconGroup />}
      {status === 'unauthenticated' || status === 'loading'
        ? (
          <div className='flex flex-row gap-x-4'>
            <button
              className='bg-reddit-orange p-2 rounded-3xl hover:brightness-50 text-white'
              onClick={() => setModalState('login')}
            > Login </button>
            <button
              className='text-reddit-orange p-2 rounded-3xl hover:brightness-50 bg-white'
              onClick={() => setModalState('signup')}
            > Sign up </button>
          </div>
        ) : (
          <button onClick={() => signOut()} className='bg-reddit-orange p-2'> Logout </button>
        )
      }
      {loginWindow}
      {signUpWindow}
    </nav>
  )
}

export default NavBar