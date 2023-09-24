'use client'

import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { SubredditType } from '@/types/types'
import { LuCake } from 'react-icons/lu'
import { SlPencil } from 'react-icons/sl'

interface CommunityProps {
  subName: string
}

function formatDate(inputDate: string) {
  const date = new Date(inputDate);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const AboutCommunity: React.FC<CommunityProps> = ({ subName }) => {
  const session = useSession()
  const { status, data: sessionData } = session
  const userName = sessionData?.user?.name || ''

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, mutate } = useSWR<SubredditType>(`/api/r/${subName}`, fetcher)

  const {
    createdAt,
    creator,
    description = '',
  } = data || {}

  const [desc, setDesc] = useState<string>(description)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setDesc(description)
  }, [description])

  const datePart = createdAt?.split('T')[0]
  const datePartFormatted = datePart ? formatDate(datePart) : ''

  const toggleEditing = () => {
    setIsEditing(prevState => !prevState)
    setDesc('')
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target: { value } } = event
    setDesc(value)
  }

  /**
   * Storing the editable text if the sub author wants to edit the description
   */
  const editableDescription = (
    <>
      {description === '' ? (
        isEditing ? (
          <form className='flex flex-col'>
            <textarea
              className='p-1 border border-transparent resize-none focus:border-slate-100 bg-reddit-gray placeholder:text-reddit-placeholder-gray'
              placeholder='Tell us about your community'
              value={desc}
              onChange={handleChange}
            />
            <div className='flex justify-between p-1 bg-reddit-gray'>
              <span> 500 characters remaining </span>
              <div className='flex flex-row text-xs gap-x-2'>
                <button className='text-red-600' onClick={toggleEditing} type='button'> Cancel </button>
                <button className='text-slate-100' type='submit'> Save </button>
              </div>
            </div>
          </form>
        ) : (
          <div className='flex flex-row px-2 py-1 duration-300 border border-black bg-reddit-gray hover:border-slate-100 hover:cursor-pointer' onClick={toggleEditing}>
            <span className='tracking-tight'> Add a description</span>
          </div>
        )
      ) : (
        <>
          <span> {description} </span>
          <SlPencil onClick={toggleEditing} />
        </>
      )}
    </>
  )

  return (
    <main className='flex flex-col p-2 border rounded bg-reddit-dark gap-y-2 border-reddit-border'>
      <h3 className='text-base tracking-tight text-reddit-placeholder-gray'>
        About Community
      </h3>
      {creator !== userName ? (
        <p>
          {description}
        </p>
      ) : (
        <>
          {editableDescription}
        </>
      )}
      <div className='flex flex-row items-center gap-x-2'>
        <LuCake className='w-6 h-6 text-white' />
        <span className='text-reddit-placeholder-gray'>
          {`Created on ${datePartFormatted}`}
        </span>
      </div>
    </main>
  )
}

export default AboutCommunity