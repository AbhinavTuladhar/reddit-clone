'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { ModalStateType } from '@/types/types'
import { RxCross2 } from 'react-icons/rx'

const modalParentClassName = 'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75'
const modalChild1ClassName = 'h-[95%] my-2 w-[25rem] flex flex-col justify-center items-center mx-auto relative bg-white rounded-xl'
const modalContainerClassName = 'w-3/4 mx-auto'

const dividerBorder = (
  <div className="relative flex py-5 items-center">
    <div className="flex-grow border-t border-gray-100"></div>
    <span className="flex-shrink mx-4 text-black"> OR </span>
    <div className="flex-grow border-t border-gray-100"></div>
  </div>
)

interface ModalProps {
  modalState: ModalStateType,
  setModalState: (state: ModalStateType) => void
}

interface SignInFormType {
  userName: string,
  password: string
}

export const LoginWindow: React.FC<ModalProps> = ({ modalState, setModalState }) => {
  const [formData, setFormData] = useState<SignInFormType>({
    userName: '',
    password: ''
  })

  const handleGoogleSignIn = () => {
    signIn('google')
    setModalState('closed')
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = event
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(formData)
  }

  return (
    <main className={`${modalState === 'login' ? modalParentClassName : 'hidden'} text-black`}>
      <div className={modalChild1ClassName}>
        <RxCross2
          className='hover:cursor-pointer top-0 right-0 absolute mr-4 mt-4'
          onClick={() => setModalState('closed')}
        />
        <section className={modalContainerClassName}>
          <div className='flex flex-col gap-y-2'>
            <span className='text-xl font-bold'> Login </span>
            <span className='text-sm'> By continuing, you are setting up a Reddit account and agree to our User Agreement and Privacy Policy. </span>
          </div>
          <div
            className='w-full py-2 flex justify-center items-center border-[1px] border-gray-300 rounded-full my-4 hover:cursor-pointer hover:bg-blue-50'
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </div>
          <>
            {dividerBorder}
          </>
          <form className='w-full flex flex-col gap-y-4' onSubmit={handleSubmit}>
            <input
              type='text'
              className='w-full border-gray-300 border-[1px] rounded-full p-3'
              name='userName'
              value={formData.userName}
              placeholder='Username'
              onChange={handleFormChange}
            />
            <input
              type='password'
              className='w-full border-gray-300 border-[1px] rounded-full p-3'
              name='password'
              value={formData.password}
              placeholder='Password'
              onChange={handleFormChange}
            />
            <button className='w-full bg-reddit-orange text-white rounded-full text-sm py-3 hover:brightness-110'> Log In </button>
          </form>
          <div className='my-2'>
            <span> New to Reddit? </span>
            <span className='text-blue-500 underline font-bold hover:text-red-500 hover:cursor-pointer' onClick={() => setModalState('signup')}>Sign up!</span>
          </div>
        </section>
      </div>
    </main>
  )
}

export const SignupWindow: React.FC<ModalProps> = ({ modalState, setModalState }) => {
  return (
    <main className={`${modalState === 'signup' ? modalParentClassName : 'hidden'} text-black`}>
      <div className={modalChild1ClassName}>
        <RxCross2
          className='hover:cursor-pointer top-0 right-0 absolute mr-4 mt-4'
          onClick={() => setModalState('closed')}
        />
        <p> This is the login window </p>
        <button className='bg-purple-400 p-2' onClick={() => setModalState('closed')}> Close window </button>
      </div>
    </main>
  )
}