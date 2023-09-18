'use client'

import React, { useState, useEffect } from 'react'
import { RxCross2 } from 'react-icons/rx'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface SubProps {
  handleModalView: () => void,
  mutateData: () => void
}

const SubCreationWindow: React.FC<SubProps> = ({ handleModalView, mutateData }) => {
  const nameLimit = 21
  const [charactersRemaining, setCharactersRemaining] = useState(nameLimit)
  const [subredditName, setSubredditName] = useState('')
  const session = useSession()
  const router = useRouter()

  const email = session?.data?.user?.email || null

  useEffect(() => {
    const subLength = subredditName.length
    setCharactersRemaining(nameLimit - subLength)
  }, [subredditName])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    if (subredditName.length < nameLimit) {
      setSubredditName(value)
    }
  }

  const handleClose = () => {
    handleModalView()
    setSubredditName('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubredditName('')

    const response = await axios.post('/api/r', { email, subredditName })
    response.status === 201 && router.push('/?success=subreddit created')

    mutateData()
    handleModalView()
  }

  return (
    <div className='flex flex-col py-4 gap-y-4'>
      <RxCross2 onClick={handleClose} className='absolute top-0 right-0 mt-4 mr-4 hover:cursor-pointer' />
      <div className='flex flex-row justify-between items-center border-b-[1px] border-reddit-border pb-4'>
        <h3 className='text-lg'>
          Create a community
        </h3>
      </div>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl'>
          Name
        </h1>
        <p className='text-sm'>
          Community names including capitalization cannot be changed.
        </p>
      </div>
      <form className='flex flex-col gap-y-4' onSubmit={handleSubmit}>
        <input
          className='p-2 text-white border border-reddit-border bg-reddit-dark'
          type='text'
          value={subredditName}
          onChange={handleChange}
        />
        <span className='text-sm'>
          {charactersRemaining} characters remaining.
        </span>
        <button className='p-2 text-black bg-white rounded-full'>
          Create community
        </button>
      </form>
    </div>
  )
}

export default SubCreationWindow