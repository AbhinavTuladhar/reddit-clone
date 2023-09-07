'use client'

import React, { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { ModalStateType } from '@/types/types'
import { RxCross2 } from 'react-icons/rx'
import { AiOutlineArrowLeft } from 'react-icons/ai'

const modalParentClassName = 'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75'
const modalChild1ClassName = 'h-[95%] my-2 w-[25rem] flex flex-col justify-center items-center mx-auto relative bg-reddit-dark text-white rounded-xl'
const modalContainerClassName = 'w-3/4 mx-auto'

const dividerBorder = (
  <div className="relative flex py-5 items-center">
    <div className="flex-grow border-t border-gray-100"></div>
    <span className="flex-shrink mx-4 text-white"> OR </span>
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
    signIn('credentials', formData)
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
            className='w-full py-2 flex justify-center items-center border-[1px] border-gray-300 rounded-full my-4 hover:cursor-pointer hover:bg-gray-900'
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
              className='w-full border-gray-300 border-[1px] rounded-full p-3 text-black'
              name='userName'
              value={formData.userName}
              placeholder='Username'
              onChange={handleFormChange}
            />
            <input
              type='password'
              className='w-full border-gray-300 border-[1px] rounded-full p-3 text-black'
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
  type SignUpPage = 'Page 1' | 'Page 2'
  interface SignUpFormType {
    email: string,
    userName: string,
    password: string,
    confirmation: string
  }

  const [currentPage, setCurrentPage] = useState<SignUpPage>('Page 1')
  const [buttonDisabledFlag, setButtonDisabledFlag] = useState(true)
  const [formData, setFormData] = useState<SignUpFormType>({
    email: '',
    userName: '',
    password: '',
    confirmation: ''
  })

  useEffect(() => {
    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (EMAIL_REGEX.test(formData.email)) {
      setButtonDisabledFlag(false)
    } else {
      setButtonDisabledFlag(true)
    }
  }, [formData.email])

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

  const firstPage = (
    <main className={`${modalParentClassName} text-black`}>
      <div className={modalChild1ClassName}>
        <RxCross2
          className='hover:cursor-pointer top-0 right-0 absolute mr-4 mt-4'
          onClick={() => setModalState('closed')}
        />
        <section className={modalContainerClassName}>
          <div className='flex flex-col gap-y-2'>
            <span className='text-xl font-bold'> Sign Up </span>
            <span className='text-sm'> By continuing, you are setting up a Reddit account and agree to our User Agreement and Privacy Policy. </span>
          </div>
          <div
            className='w-full py-2 flex justify-center items-center border-[1px] border-gray-300 rounded-full my-4 hover:cursor-pointer hover:bg-gray-900'
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </div>
          <>
            {dividerBorder}
          </>
          <input
            type='email'
            className='w-full border-gray-300 border-[1px] rounded-full p-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            invalid:border-pink-500 invalid:text-pink-600
            focus:invalid:border-pink-500 focus:invalid:ring-pink-500'
            name='email'
            value={formData.email}
            placeholder='Email'
            onChange={handleFormChange}
          />
          <button
            className='bg-reddit-orange py-2 my-4 text-white w-full rounded-full disabled:bg-red-100'
            disabled={buttonDisabledFlag}
            onClick={() => setCurrentPage('Page 2')}
          > Continue </button>
          <div className='my-2'>
            <span> Already a Redditor? </span>
            <span className='text-blue-500 underline font-bold hover:text-red-500 hover:cursor-pointer' onClick={() => setModalState('login')}>Log in!</span>
          </div>
        </section>
      </div>
    </main>
  )

  const secondPage = (
    <main className={`${modalParentClassName} text-black`}>
      <div className={modalChild1ClassName}>
        <AiOutlineArrowLeft
          className='hover:cursor-pointer top-0 left-0 absolute ml-4 mt-4'
          onClick={() => setCurrentPage('Page 1')}
        />
        <section className={modalContainerClassName}>
          <div className='flex flex-col gap-y-2'>
            <h3 className='text-lg font-bold'>
              Create your username and password
            </h3>
            <span className='text-sm'>
              Reddit is anonymous, so your username is what you’ll go by here. Choose wisely—because once you get a name, you can’t change it.
            </span>
          </div>
          <form className='w-full flex flex-col gap-y-4 mt-4'>
            <input
              type='text'
              className='w-full border-gray-300 border-[1px] rounded-full p-3 text-black'
              name='userName'
              value={formData.userName}
              placeholder='Username'
              onChange={handleFormChange}
            />
            <input
              type='password'
              className='w-full border-gray-300 border-[1px] rounded-full p-3 text-black'
              name='password'
              value={formData.password}
              placeholder='Password'
              onChange={handleFormChange}
            />
            <input
              type='password'
              className='w-full border-gray-300 border-[1px] rounded-full p-3'
              name='Password'
              value={formData.confirmation}
              placeholder='Confirm Password'
              onChange={handleFormChange}
            />
            <button className='w-full bg-reddit-orange text-white rounded-full text-sm py-3 hover:brightness-110'> Sign up </button>
          </form>
        </section>
      </div>
    </main>
  )

  return (
    <>
      {modalState === 'signup' && currentPage === 'Page 1' ? (
        <> {firstPage} </>
      ) : (
        modalState === 'signup' ? (
          <> {secondPage} </>
        ) : null
      )}
    </>
  );
}

interface SubProps {
  handleModalView: () => void
}

export const SubCreationWindow: React.FC<SubProps> = ({ handleModalView }) => {
  return (
    <main className={modalParentClassName}>
      <section className={`${modalChild1ClassName} h-fit bg-reddit-gray border-[1px] border-reddit-border`}>
        <div className={`${modalContainerClassName} flex flex-col gap-y-4 py-4`}>
          <div className='flex flex-row justify-between items-center border-b-[1px] border-reddit-border pb-4'>
            <h3 className='text-lg'>
              Create a community
            </h3>
            <RxCross2 onClick={handleModalView} className='hover:cursor-pointer' />
          </div>
          <div className='flex flex-col gap-y-2'>
            <h1 className='text-xl'>
              Name
            </h1>
            <p className='text-sm'>
              Community names including capitalization cannot be changed.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}