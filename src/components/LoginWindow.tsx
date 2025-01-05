'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { RxCross2 } from 'react-icons/rx'

import { ModalProps } from '@/types'

const LoginWindow: React.FC<ModalProps> = ({ setModalState }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  })

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // console.log(formData)
    await signIn('credentials', formData)
    router.push('/')
  }

  return (
    <>
      <RxCross2
        className="absolute right-0 top-0 mr-4 mt-4 hover:cursor-pointer"
        onClick={() => setModalState('closed')}
      />
      <div className="mb-4 flex flex-col gap-y-2">
        <span className="text-xl font-bold"> Login </span>
        <span className="text-sm">
          {' '}
          By continuing, you are setting up a Reddit account and agree to our User Agreement and Privacy Policy.{' '}
        </span>
      </div>
      {/* <div
        className='w-full py-2 flex justify-center items-center border-[1px] border-gray-300 rounded-full my-4 hover:cursor-pointer hover:bg-gray-900'
        onClick={handleGoogleSignIn}
      >
        Continue with Google
      </div>
      <BorderDivider /> */}
      <form className="flex w-full flex-col gap-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full rounded-full border-[1px] border-gray-300 p-3 text-black"
          name="name"
          value={formData.name}
          placeholder="name"
          onChange={handleFormChange}
        />
        <input
          type="password"
          className="w-full rounded-full border-[1px] border-gray-300 p-3 text-black"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleFormChange}
        />
        <button className="w-full rounded-full bg-reddit-orange py-3 text-sm text-white hover:brightness-110">
          {' '}
          Log In{' '}
        </button>
      </form>
      <div className="my-2">
        <span> New to Reddit? </span>
        <span
          className="font-bold text-blue-500 underline hover:cursor-pointer hover:text-red-500"
          onClick={() => setModalState('signup')}
        >
          Sign up!
        </span>
      </div>
    </>
  )
}

export default LoginWindow
