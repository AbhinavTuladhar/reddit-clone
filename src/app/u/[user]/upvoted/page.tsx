'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr';
import axios from 'axios'
import PostCard from '@/components/PostCard';

interface UserParams {
  params: {
    user: string
  }
}

interface ResponseType {
  upvotedIds: string[]
  downvotedIds: string[]
}

const page: React.FC<UserParams> = ({ params }) => {
  const userName = params.user
  const session = useSession()
  const currentUser = session.data?.user?.name

  const fetcher = (url: string) => axios.get(url).then(response => response.data)
  const { data: votedPosts } = useSWR<ResponseType>(`/api/u/${userName}?voted=yes`, fetcher)

  if (userName !== currentUser) {
    return (
      <div className='flex flex-row items-center justify-center flex-1 h-screen text-xl bg-reddit-dark'>
        You do not have permission to access this resource.
      </div>
    )
  }

  return (
    <main className='flex flex-col gap-y-2'>
      {votedPosts?.upvotedIds?.map((post, index) => (
        <PostCard id={post} subViewFlag={true} key={index} />
      ))}
    </main>
  )
}

export default page