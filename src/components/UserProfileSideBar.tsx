'use client'

import React, { useState } from 'react'
import useSWR from 'swr';
import axios from 'axios'
import Image from 'next/image';
import ProfilePic from '../images/profile_pic.png'
import { UserType } from '@/types/types';
import { PiFlowerFill } from 'react-icons/pi'
import { LuCake } from 'react-icons/lu'

function formatDate(inputDate: string) {
  const date = new Date(inputDate);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

interface SideBarProps {
  userName: string
}

const UserProfileSideBar: React.FC<SideBarProps> = ({ userName }) => {
  const fetcher = (url: string) => axios.get(url).then(response => response.data)
  const { data: userData } = useSWR<UserType>(`/api/u/${userName}`, fetcher)

  const {
    bio,
    commentKarma = 0,
    postKarma = 0,
    createdAt
  } = userData || {}

  const effectiveKarma = Math.max(1, commentKarma + postKarma)
  const datePart = createdAt?.split('T')[0]
  const datePartFormatted = datePart ? formatDate(datePart) : ''

  return (
    <div className='flex flex-col border rounded border-reddit-border'>
      <div className='w-full h-24 bg-blue-500' />
      <main className='flex flex-col p-4 bg-reddit-dark gap-y-2'>
        <Image src={ProfilePic} alt='profile picture' className='w-24 -mt-20 border-4 aspect-square border-reddit-dark' />
        <span> {`u/${userName}`} </span>

        <section className='flex flex-row justify-between text-xs'>

          <div className='flex flex-col gap-y-0.5'>
            <h1 className='text-sm font-bold'> Karma </h1>
            <div className='flex flex-row items-center gap-x-1'>
              <PiFlowerFill className='w-4 h-4 text-blue-500' />
              <span className='text-reddit-placeholder-gray'> {effectiveKarma} </span>
            </div>
          </div>

          <div className='flex flex-col gap-y-0.5'>
            <h1 className='text-sm font-bold'> Cake day </h1>
            <div className='flex flex-row items-center gap-x-1'>
              <LuCake className='w-4 h-4 text-blue-500' />
              <span className='text-reddit-placeholder-gray'> {datePartFormatted} </span>
            </div>
          </div>

        </section>
      </main>
    </div>
  )
}

export default UserProfileSideBar