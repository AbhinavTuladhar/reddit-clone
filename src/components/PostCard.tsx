'use client'

import React, { useState } from 'react'
import Link from 'next/link';
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import { PostType, voteStatus } from '@/types/types'
import useSWR from 'swr';
import classnames from 'classnames';
import calculateDateString from '@/utils/calculateDateString';
import { useSession } from 'next-auth/react';
import axios from 'axios'

interface PostProps {
  id: string
}

const PostCard: React.FC<PostProps> = ({
  id,
}) => {
  const session = useSession()
  const { status, data: sessionData } = session
  const userName = sessionData?.user?.name || ''

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, mutate } = useSWR<PostType>(`/api/post/${id}`, fetcher)

  const {
    author = '',
    subreddit,
    title,
    body = '',
    createdAt = '',
    upvotedBy = [],
    downvotedBy = [],
    comments
  } = data || {}

  // Check if the user is in the upvote or downvotedby list in the comment
  let initialVoteStatus: voteStatus

  if (upvotedBy.includes(userName)) {
    initialVoteStatus = 'upvoted'
  } else if (downvotedBy.includes(userName)) {
    initialVoteStatus = 'downvoted'
  } else {
    initialVoteStatus = 'nonvoted'
  }

  const [voteStatus, setVoteStatus] = useState<voteStatus>(initialVoteStatus)

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1
  const dateString = calculateDateString(new Date(createdAt), new Date())

  const handleVoteChange = async (targetStatus: voteStatus) => {
    if (status !== 'authenticated') {
      alert('Please login to vote.')
      return
    }

    let newVoteStatus: voteStatus = 'nonvoted'

    if (voteStatus === targetStatus && targetStatus === 'upvoted') {
      newVoteStatus = 'nonvoted'
      setVoteStatus('nonvoted')
    } else if (voteStatus === targetStatus && targetStatus === 'downvoted') {
      newVoteStatus = 'nonvoted'
      setVoteStatus('nonvoted')
    } else if (targetStatus === 'upvoted' && voteStatus === 'nonvoted') {
      newVoteStatus = 'upvoted'
      setVoteStatus('upvoted')
    } else if (targetStatus === 'downvoted' && voteStatus === 'nonvoted') {
      newVoteStatus = 'downvoted'
      setVoteStatus('downvoted')
    } else if (targetStatus === 'downvoted' && voteStatus === 'upvoted') {
      newVoteStatus = 'downvoted'
      setVoteStatus('downvoted')
    } else if (targetStatus === 'upvoted' && voteStatus === 'downvoted') {
      newVoteStatus = 'upvoted'
      setVoteStatus('upvoted')
    }

    const requestBody = { user: userName, voteTarget: newVoteStatus }

    await axios.patch(`/api/post/${id}`, requestBody)
    mutate()
  }

  const iconBaseClassName = 'w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

  return (
    <main className='flex flex-row items-center px-4 py-2 border gap-x-4 bg-reddit-dark border-reddit-border hover:cursor-poiner hover:border-white'>
      <div className='flex flex-col items-center'>
        <PiArrowFatUpFill
          className={classnames(
            iconBaseClassName,
            { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
            { 'text-reddit-orange': voteStatus === 'upvoted' },
            'hover:text-reddit-orange'
          )}
          onClick={() => handleVoteChange('upvoted')}
        />
        <span
          className={classnames(
            { 'text-reddit-placeholder-gray': voteStatus === 'nonvoted' },
            { 'text-reddit-orange': voteStatus === 'upvoted' },
            { 'text-indigo-400': voteStatus === 'downvoted' },
          )}
        >
          {effectiveKarma}
        </span>
        <PiArrowFatDownFill
          className={classnames(
            iconBaseClassName,
            { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
            { 'text-indigo-400': voteStatus === 'downvoted' },
            'hover:text-indigo-400'
          )}
          onClick={() => handleVoteChange('downvoted')}
        />
      </div>
      <Link href={`/r/${subreddit}/comments/${id}`} className='flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-1'>
          <h1 className='text-lg'>
            {title}
          </h1>
          <div className='flex flex-row items-center text-sm gap-x-1'>
            <span className='font-bold'> {`r/${subreddit}`} </span>
            <span className='text-gray-400'> {`Posted by u/${author}`} </span>
            <span className='text-reddit-placeholder-gray'> {dateString} </span>
          </div>
        </div>
      </Link>
    </main>
  )
}

export default PostCard