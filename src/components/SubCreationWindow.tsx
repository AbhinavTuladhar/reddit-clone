'use client'

import React, { useState, useEffect } from 'react'
import { RxCross2 } from 'react-icons/rx'

interface SubProps {
  handleModalView: () => void
}

const SubCreationWindow: React.FC<SubProps> = ({ handleModalView }) => {
  const nameLimit = 21
  const [charactersRemaining, setCharactersRemaining] = useState(nameLimit)
  const [subredditName, setSubredditName] = useState('')

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

  return (
    <div className='flex flex-col gap-y-4 py-4'>
      <RxCross2 onClick={handleClose} className='hover:cursor-pointer top-0 right-0 absolute mr-4 mt-4' />
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
      <div className='flex flex-col gap-y-4'>
        <input
          className='border-reddit-border border bg-reddit-dark p-2 text-white'
          type='text'
          value={subredditName}
          onChange={handleChange}
        />
        <span className='text-sm'>
          {charactersRemaining} characters remaining.
        </span>
      </div>
    </div>
  )
}

export default SubCreationWindow