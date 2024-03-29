'use client'

import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { SubredditType } from '@/types/types'
import { LuCake } from 'react-icons/lu'
import { SlPencil } from 'react-icons/sl'
import { SubDescChangeBody } from '@/types/types'
import axios from 'axios'

interface CommunityProps {
  subName: string
}

function formatDate(inputDate: string) {
  const date = new Date(inputDate)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const AboutCommunity: React.FC<CommunityProps> = ({ subName }) => {
  const session = useSession()
  const { data: sessionData } = session
  const userName = sessionData?.user?.name || ''

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, mutate } = useSWR<SubredditType>(`/api/r/${subName}`, fetcher)

  const { createdAt, creator, description = '', subscribers = [] } = data || {}

  const [desc, setDesc] = useState<string>(description)
  const [charactersRemaining, setCharactersRemaining] = useState(500)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setDesc(description)
  }, [description])

  // const datePart = createdAt?.split('T')[0]
  const datePart = createdAt?.toString().split('T')[0]
  const datePartFormatted = datePart ? formatDate(datePart) : ''

  // This is for rendering paragraphs in the descritpion
  const descriptionParts = description.split('\n')

  const toggleEditing = () => {
    setIsEditing((prevState) => !prevState)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event
    if (desc.length <= 500) {
      setDesc(value)
    }
  }

  useEffect(() => {
    const descLength = desc.length
    setCharactersRemaining(500 - descLength)
  }, [desc])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const DescChangeBody: SubDescChangeBody = {
      description: desc,
      name: subName,
    }

    await axios.patch(`/api/r/${subName}`, DescChangeBody)
    toggleEditing()
    mutate()
  }

  const editableDescription = (
    <>
      {!isEditing ? (
        description === '' ? (
          <div
            className="flex flex-row border border-black bg-reddit-gray px-2 py-1 duration-300 hover:cursor-pointer hover:border-slate-100"
            onClick={toggleEditing}
          >
            <span className="tracking-tight"> Add a description</span>
          </div>
        ) : (
          <div className="flex flex-row gap-x-2">
            <p>
              {descriptionParts.map((part: string, index) => (
                <div key={index}>
                  <span> {part} </span>
                  <br />
                </div>
              ))}
            </p>
            <SlPencil onClick={toggleEditing} className="hover:cursor-pointer" />
          </div>
        )
      ) : (
        <form className="peer flex flex-col" onSubmit={handleSubmit}>
          <textarea
            className="resize-none border border-reddit-gray bg-reddit-gray p-1 placeholder:text-reddit-placeholder-gray peer-focus:border peer-focus:border-slate-100"
            placeholder="Tell us about your community"
            value={desc}
            onChange={handleChange}
          />
          <div className="mt-[1px] flex justify-between bg-reddit-gray p-1 peer-focus:border-slate-100">
            <span className="text-reddit-placeholder-gray"> {`${charactersRemaining} characters remaining`} </span>
            <div className="flex flex-row gap-x-2 text-xs">
              <button className="text-red-600" onClick={toggleEditing} type="button">
                {' '}
                Cancel{' '}
              </button>
              <button className="text-slate-100" type="submit">
                {' '}
                Save{' '}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  )

  return (
    <main className="flex flex-col gap-y-2 rounded border border-reddit-border bg-reddit-dark p-2">
      <h3 className="text-base tracking-tight text-reddit-placeholder-gray">About Community</h3>
      {creator !== userName ? (
        <p>
          {descriptionParts.map((part: string, index) => (
            <div key={index}>
              <span> {part} </span>
              <br />
            </div>
          ))}
        </p>
      ) : (
        <>{editableDescription}</>
      )}
      <div className="flex flex-row items-center gap-x-2 border-b border-reddit-border pb-2">
        <LuCake className="h-6 w-6 text-white" />
        <span className="text-reddit-placeholder-gray">{`Created on ${datePartFormatted}`}</span>
      </div>
      <div className="flex flex-col gap-y-0">
        <h1 className="text-lg font-bold"> {subscribers.length} </h1>
        <small className="text-xs text-reddit-placeholder-gray"> members </small>
      </div>
    </main>
  )
}

export default AboutCommunity
