'use client'

import React, { useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiReddit } from 'react-icons/si'
import { signOut, useSession } from 'next-auth/react'
import useSWR from 'swr'
import Subreddit from './Subreddit'
import Searchbar from './Searchbar'
import IconGroup from './IconGroup'
import ModalContainer from './ModalContainer'
import LoginWindow from './LoginWindow'
import SignupWindow from './SignupWindow'
import UserOptions from './UserOptions'
import { ModalStateType } from '@/types/types'
import { SessionContext } from './SessionContext'
import { GiMegaphone } from 'react-icons/gi'
import Loader from './Loader'

interface SubListResponse {
  name: string,
  creatorName: string
}

const NavBar = () => {
  const router = useRouter()
  const session = useSession()
  const { status } = session
  const sessionNew = useContext(SessionContext)

  // const { session: newSession } = sessionNew
  // const { data: sessionData, status: newStatus } = newSession || {}

  // const { user, expires } = (sessionData as { user: { email: string; name: string }; expires: string }) || {};

  const [modalState, setModalState] = useState<ModalStateType>('closed')

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, mutate: mutateSubredditList } = useSWR<SubListResponse[]>('/api/r', fetcher)

  const subredditList = data?.map(row => `r/${row.name}`)

  const handleLogOut = async () => {
    const data = await signOut({ callbackUrl: '/', redirect: false })
    router.push(data.url)
  }

  return (
    <nav className='z-20 bg-reddit-dark px-6 h-12 flex flex-row justify-between gap-x-2 items-center border-b-[1px] border-reddit-border top-0 fixed w-screen'>
      <Link className='flex flex-row items-center gap-x-2' href='/'>
        <SiReddit className='w-8 h-8 bg-white rounded-full text-reddit-orange' />
        <h1 className='hidden text-xl text-white lg:block'> reddit </h1>
      </Link>
      <Subreddit subredditList={subredditList} />
      <Searchbar />
      {status === 'unauthenticated'
        ? (
          <div className='flex flex-row gap-x-4'>
            <button
              className='p-2 text-white bg-reddit-orange rounded-3xl hover:brightness-50 whitespace-nowrap'
              onClick={() => setModalState('login')}
            > Log In </button>
            <button
              className='p-2 bg-white text-reddit-orange rounded-3xl hover:brightness-50 whitespace-nowrap'
              onClick={() => setModalState('signup')}
            > Sign up </button>
          </div>
        ) : (
          status === 'authenticated'
            ? (
              <>
                <IconGroup mutateData={mutateSubredditList} />
                <div className='hidden lg:flex hover:cursor-pointer text-sm duration-300 bg-[#303030] hover:brightness-110 flex-row items-center pl-1 pr-2 py-1 border rounded-full border-reddit-border gap-x-0.5'>
                  <GiMegaphone className='w-10 h-6' />
                  <span> Advertise </span>
                </div>
                <UserOptions userName={session?.data?.user?.name} />
              </>
            ) : (
              <Loader />
            )
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