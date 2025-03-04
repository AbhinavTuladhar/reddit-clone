'use client'

import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { GiMegaphone } from 'react-icons/gi'
import { SiReddit } from 'react-icons/si'

import useCurrentUser from '@/hooks/useCurrentUser'
import { ModalStateType } from '@/types'

import IconGroup from './IconGroup'
import Loader from './Loader'
import LoginWindow from './LoginWindow'
import ModalContainer from './ModalContainer'
import NavbarBreadcrumb from './navbar-breadcrumb'
import Searchbar from './Searchbar'
import SignupWindow from './SignupWindow'
import UserOptions from './UserOptions'

const NavBar = () => {
  const { status, userName } = useCurrentUser()
  const [modalState, setModalState] = useState<ModalStateType>('closed')

  return (
    <nav className="fixed top-0 z-[5000] flex h-12 w-screen flex-row items-center justify-between gap-x-2 border-b-[1px] border-reddit-border bg-reddit-dark px-6">
      <Link className="flex flex-row items-center gap-x-2" href="/">
        <SiReddit className="h-8 w-8 rounded-full bg-white text-reddit-orange" />
        <h1 className="hidden text-xl text-white lg:block"> reddit </h1>
      </Link>
      <NavbarBreadcrumb />
      <Searchbar />
      {status === 'unauthenticated' ? (
        <div className="flex flex-row gap-x-4">
          <button
            className="whitespace-nowrap rounded-3xl bg-reddit-orange p-2 text-white hover:brightness-50"
            onClick={() => setModalState('login')}
          >
            Log In
          </button>
          <button
            className="whitespace-nowrap rounded-3xl bg-white p-2 text-reddit-orange hover:brightness-50"
            onClick={() => setModalState('signup')}
          >
            Sign up
          </button>
        </div>
      ) : status === 'authenticated' ? (
        <>
          <IconGroup />
          <div className="hidden flex-row items-center gap-x-0.5 rounded-full border border-reddit-border bg-[#303030] py-1 pl-1 pr-2 text-sm duration-300 hover:cursor-pointer hover:brightness-110 lg:flex">
            <GiMegaphone className="h-6 w-10" />
            <span> Advertise </span>
          </div>
          <Suspense fallback={<Loader />}>
            <UserOptions userName={userName} />
          </Suspense>
        </>
      ) : (
        <Loader />
      )}
      {typeof window === 'object' &&
        createPortal(
          <ModalContainer visibilityFlag={modalState === 'login'}>
            <LoginWindow modalState={modalState} setModalState={setModalState} />
          </ModalContainer>,
          document.body,
        )}
      {typeof window === 'object' &&
        createPortal(
          <ModalContainer visibilityFlag={modalState === 'signup'}>
            <SignupWindow modalState={modalState} setModalState={setModalState} />
          </ModalContainer>,
          document.body,
        )}
    </nav>
  )
}

export default NavBar
