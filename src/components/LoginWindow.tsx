'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { ModalProps } from '@/types/types'
import { RxCross2 } from 'react-icons/rx'
import BorderDivider from './BorderDivider'

const LoginWindow: React.FC<ModalProps> = ({ modalState, setModalState }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  })

  const handleGoogleSignIn = async () => {
    await signIn('google')
    setModalState('closed')
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = event
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // console.log(formData)
    await signIn('credentials', formData)
  }

  return (
    <>
      <RxCross2
        className='absolute top-0 right-0 mt-4 mr-4 hover:cursor-pointer'
        onClick={() => setModalState('closed')}
      />
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
      <BorderDivider />
      <form className='flex flex-col w-full gap-y-4' onSubmit={handleSubmit}>
        <input
          type='text'
          className='w-full border-gray-300 border-[1px] rounded-full p-3 text-black'
          name='name'
          value={formData.name}
          placeholder='name'
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
        <button className='w-full py-3 text-sm text-white rounded-full bg-reddit-orange hover:brightness-110'> Log In </button>
      </form>
      <div className='my-2'>
        <span> New to Reddit? </span>
        <span className='font-bold text-blue-500 underline hover:text-red-500 hover:cursor-pointer' onClick={() => setModalState('signup')}>Sign up!</span>
      </div>
    </>
  )
}

export default LoginWindow