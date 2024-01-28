'use client'

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import ProfilePic from '../images/profile_pic.png'
import { UserType } from '@/types/types'
import { PiFlowerFill } from 'react-icons/pi'
import { LuCake } from 'react-icons/lu'
import { UserBioChangeBody } from '@/types/types'
import { SlPencil } from 'react-icons/sl'

function formatDate(inputDate: string) {
  const date = new Date(inputDate)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface SideBarProps {
  userName: string
}

const UserProfileSideBar: React.FC<SideBarProps> = ({ userName }) => {
  const { data } = useSession()
  const currentUser = data?.user?.name

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data)
  const { data: userData, mutate } = useSWR<UserType>(
    `/api/u/${userName}`,
    fetcher
  )

  const {
    bio = '',
    commentKarma = 0,
    postKarma = 0,
    createdAt,
  } = userData || {}

  const [desc, setDesc] = useState<string>(bio)
  const [charactersRemaining, setCharactersRemaining] = useState(500)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setDesc(bio)
  }, [bio])

  const effectiveKarma = Math.max(1, commentKarma + postKarma)
  const datePart = createdAt?.toString().split('T')[0]
  const datePartFormatted = datePart ? formatDate(datePart) : ''

  // This is for rendering paragraphs in the bio
  const bioParts = bio.split('\n')

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
    const BioChangeBody: UserBioChangeBody = {
      bio: desc,
      name: userName,
    }

    await axios.patch(`/api/u/${userName}/bioChange`, BioChangeBody)
    toggleEditing()
    mutate()
  }

  const editableBio = (
    <>
      {!isEditing ? (
        bio === '' ? (
          <div
            className="flex flex-row px-2 py-1 duration-300 border border-black bg-reddit-gray hover:border-slate-100 hover:cursor-pointer"
            onClick={toggleEditing}
          >
            <span className="tracking-tight"> Add your bio </span>
          </div>
        ) : (
          <div className="flex flex-row gap-x-2">
            <p>
              {bioParts.map((part: string, index) => (
                <div key={index}>
                  <span> {part} </span>
                  <br />
                </div>
              ))}
            </p>
            <SlPencil
              onClick={toggleEditing}
              className="hover:cursor-pointer"
            />
          </div>
        )
      ) : (
        <form className="flex flex-col peer" onSubmit={handleSubmit}>
          <textarea
            className="p-1 border resize-none border-reddit-gray bg-reddit-gray placeholder:text-reddit-placeholder-gray peer-focus:border-slate-100 peer-focus:border"
            placeholder="Say something about yourself."
            value={desc}
            onChange={handleChange}
          />
          <div className="flex justify-between p-1 mt-[1px] bg-reddit-gray peer-focus:border-slate-100">
            <span className="text-reddit-placeholder-gray">
              {' '}
              {`${charactersRemaining} characters remaining`}{' '}
            </span>
            <div className="flex flex-row text-xs gap-x-2">
              <button
                className="text-red-600"
                onClick={toggleEditing}
                type="button"
              >
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
    <div className="flex flex-col border rounded border-reddit-border">
      <div className="w-full h-24 border rounded bg-reddit-blue border-reddit-border" />
      <main className="flex flex-col p-4 bg-reddit-dark gap-y-2">
        <Image
          src={ProfilePic}
          alt="profile picture"
          className="w-24 -mt-20 border-4 aspect-square border-reddit-dark"
        />
        <span> {`u/${userName}`} </span>

        {currentUser !== userName ? (
          bio !== '' && (
            <p>
              {bioParts.map((part: string, index) => (
                <div key={index}>
                  <span> {part} </span>
                  <br />
                </div>
              ))}
            </p>
          )
        ) : (
          <>{editableBio}</>
        )}

        <section className="flex flex-row justify-between text-xs">
          <div className="flex flex-col gap-y-0.5">
            <h1 className="text-sm font-bold"> Karma </h1>
            <div className="flex flex-row items-center gap-x-1">
              <PiFlowerFill className="w-4 h-4 text-reddit-blue" />
              <span className="text-reddit-placeholder-gray">
                {' '}
                {effectiveKarma}{' '}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-y-0.5">
            <h1 className="text-sm font-bold"> Cake day </h1>
            <div className="flex flex-row items-center gap-x-1">
              <LuCake className="w-4 h-4 text-reddit-blue" />
              <span className="text-reddit-placeholder-gray">
                {' '}
                {datePartFormatted}{' '}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default UserProfileSideBar
