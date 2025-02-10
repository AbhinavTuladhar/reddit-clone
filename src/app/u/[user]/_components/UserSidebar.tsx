'use client'

import React, { FC } from 'react'
import Image from 'next/image'
import { LuCake } from 'react-icons/lu'
import { PiFlowerFill } from 'react-icons/pi'

import useUser from '@/hooks/useUser'
import ProfilePic from '@/images/profile_pic.png'
import { formatDate } from '@/utils/date.utils'

import { UserDescription } from './UserDescription'

const UserIntro: FC<{ userName: string }> = ({ userName }) => (
  <>
    <Image src={ProfilePic} alt="profile picture" className="-mt-20 aspect-square w-24 border-4 border-reddit-dark" />
    <span> {`u/${userName}`} </span>
  </>
)

interface KarmaProps {
  postKarma: number
  commentKarma: number
}

const KarmaCard: FC<KarmaProps> = ({ postKarma, commentKarma }) => {
  const effectiveKarma = Math.max(1, commentKarma + postKarma)

  return (
    <div className="flex flex-col gap-y-0.5">
      <h1 className="text-sm font-bold"> Karma </h1>
      <div className="flex flex-row items-center gap-x-1">
        <PiFlowerFill className="h-4 w-4 text-reddit-blue" />
        <span className="text-reddit-placeholder-gray"> {effectiveKarma} </span>
      </div>
    </div>
  )
}

const DateCard: FC<{ date: Date }> = ({ date }) => {
  const datePart = date.toString().split('T')[0]
  const datePartFormatted = formatDate(datePart)

  return (
    <div className="flex flex-col gap-y-0.5">
      <h1 className="text-sm font-bold"> Cake day </h1>
      <div className="flex flex-row items-center gap-x-1">
        <LuCake className="h-4 w-4 text-reddit-blue" />
        <span className="text-reddit-placeholder-gray"> {datePartFormatted} </span>
      </div>
    </div>
  )
}

const UserSidebar: FC<{ userName: string }> = ({ userName }) => {
  const userQuery = useUser(userName)

  const { data, isLoading, isError } = userQuery

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  const { bio, commentKarma, postKarma, createdAt } = data

  return (
    <aside className="flex flex-col rounded border border-reddit-border">
      <div className="h-24 w-full rounded border border-reddit-border bg-reddit-blue" />
      <div className="flex flex-col gap-y-2 bg-reddit-dark p-4">
        <UserIntro userName={userName} />
        <UserDescription description={bio} userName={userName} />
        <div className="flex justify-between text-xs">
          <KarmaCard postKarma={postKarma} commentKarma={commentKarma} />
          <DateCard date={createdAt} />
        </div>
      </div>
    </aside>
  )
}

export default UserSidebar
