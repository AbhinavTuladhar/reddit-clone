'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { RxCross2 } from 'react-icons/rx'

import { ModalProps } from '@/types/types'

const SignupWindow: React.FC<ModalProps> = ({ modalState, setModalState }) => {
  type SignUpPage = 'Page 1' | 'Page 2'
  interface SignUpFormType {
    email: string
    name: string
    password: string
    confirmation: string
  }

  const clearForm = () => {
    return {
      email: '',
      name: '',
      password: '',
      confirmation: '',
    }
  }

  const [currentPage, setCurrentPage] = useState<SignUpPage>('Page 1')
  const [buttonDisabledFlag, setButtonDisabledFlag] = useState(true)
  const [formData, setFormData] = useState<SignUpFormType>(clearForm())
  const router = useRouter()

  useEffect(() => {
    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{3,}$/i
    if (EMAIL_REGEX.test(formData.email)) {
      setButtonDisabledFlag(false)
    } else {
      setButtonDisabledFlag(true)
    }
  }, [formData.email])

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
    const response = await axios.post('/api/auth/register', formData)
    response.status === 201 && router.push('?success=account created')
    setFormData(clearForm())
    setModalState('closed')
  }

  const firstPage = (
    <>
      <RxCross2
        className="absolute right-0 top-0 mr-4 mt-4 hover:cursor-pointer"
        onClick={() => setModalState('closed')}
      />
      <div className="mb-4 flex flex-col gap-y-2">
        <span className="text-xl font-bold"> Sign Up </span>
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
      <input
        type="email"
        className="w-full rounded-full border-[1px] border-gray-300 p-3 text-black invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline-none
            focus:ring-1 focus:ring-sky-500
            focus:invalid:border-red-500 focus:invalid:ring-red-500"
        name="email"
        value={formData.email}
        placeholder="Email"
        onChange={handleFormChange}
      />
      <button
        className="my-4 w-full rounded-full bg-reddit-orange py-2 text-white disabled:bg-red-100"
        disabled={buttonDisabledFlag}
        onClick={() => setCurrentPage('Page 2')}
      >
        {' '}
        Continue{' '}
      </button>
      <div className="my-2">
        <span> Already a Redditor? </span>
        <span
          className="font-bold text-blue-500 underline hover:cursor-pointer hover:text-red-500"
          onClick={() => setModalState('login')}
        >
          Log in!
        </span>
      </div>
    </>
  )

  const secondPage = (
    <>
      <AiOutlineArrowLeft
        className="absolute left-0 top-0 ml-4 mt-4 hover:cursor-pointer"
        onClick={() => setCurrentPage('Page 1')}
      />
      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-bold">Create your username and password</h3>
        <span className="text-sm">
          Reddit is anonymous, so your username is what you’ll go by here. Choose wisely—because once you get a name,
          you can’t change it.
        </span>
      </div>
      <form className="mt-4 flex w-full flex-col gap-y-4" onSubmit={handleSubmit}>
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
        <input
          type="password"
          className="w-full rounded-full border-[1px] border-gray-300 p-3 text-black"
          name="confirmation"
          value={formData.confirmation}
          placeholder="Confirm Password"
          onChange={handleFormChange}
        />
        <button className="w-full rounded-full bg-reddit-orange py-3 text-sm text-white hover:brightness-110">
          {' '}
          Sign up{' '}
        </button>
      </form>
    </>
  )

  return (
    <>
      {modalState === 'signup' && currentPage === 'Page 1' ? (
        <> {firstPage} </>
      ) : modalState === 'signup' ? (
        <> {secondPage} </>
      ) : null}
    </>
  )
}

export default SignupWindow
