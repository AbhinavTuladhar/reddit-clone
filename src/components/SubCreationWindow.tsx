'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { RxCross2 } from 'react-icons/rx'

import useCurrentUser from '@/hooks/useCurrentUser'
import { useQueryClient } from '@tanstack/react-query'

interface SubProps {
  handleModalView: () => void
}

const SubCreationWindow: React.FC<SubProps> = ({ handleModalView }) => {
  const queryClient = useQueryClient()
  const nameLimit = 21
  const [charactersRemaining, setCharactersRemaining] = useState(nameLimit)
  const [subredditName, setSubredditName] = useState('')
  const router = useRouter()

  const { email } = useCurrentUser()

  useEffect(() => {
    const subLength = subredditName.length
    setCharactersRemaining(nameLimit - subLength)
  }, [subredditName])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event
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

    queryClient.invalidateQueries({ queryKey: ['subreddit-list'] })
    handleModalView()
  }

  return (
    <div className="flex flex-col gap-y-4 py-4">
      <RxCross2 onClick={handleClose} className="absolute right-0 top-0 mr-4 mt-4 hover:cursor-pointer" />
      <div className="flex flex-row items-center justify-between border-b-[1px] border-reddit-border pb-4">
        <h3 className="text-lg">Create a community</h3>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl">Name</h1>
        <p className="text-sm">Community names including capitalization cannot be changed.</p>
      </div>
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
        <input
          className="border border-reddit-border bg-reddit-dark p-2 text-white"
          type="text"
          value={subredditName}
          onChange={handleChange}
        />
        <span className="text-sm">{charactersRemaining} characters remaining.</span>
        <button className="rounded-full bg-white p-2 text-black">Create community</button>
      </form>
    </div>
  )
}

export default SubCreationWindow
