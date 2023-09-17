'use client'

import React, { useState } from 'react'
import Link from 'next/link';
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import { PostType, voteStatus } from '@/types/types'
import useSWR from 'swr';
import classnames from 'classnames';

interface PostProps {
  id: string
}

const PostCard: React.FC<PostProps> = ({
  id,
}) => {
  const [voteStatus, setVoteStatus] = useState<voteStatus>('nonvoted')

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, mutate } = useSWR<PostType>(`/api/post/${id}`, fetcher)

  const {
    author,
    subreddit,
    title,
    body = '',
    createdAt,
    upvotedBy = [],
    downvotedBy = [],
    comments
  } = data || {}

  const effectiveKarma = upvotedBy?.length + downvotedBy.length === 0 ? 1 : (upvotedBy.length < downvotedBy.length ? 0 : upvotedBy.length - downvotedBy.length)

  const handleVoteChange = (targetStatus: voteStatus) => {
    if (voteStatus === targetStatus) {
      setVoteStatus('nonvoted')
    } else {
      setVoteStatus(targetStatus)
    }
  }

  const iconBaseClassName = 'w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

  return (
    <main className='flex flex-row items-center gap-x-4 bg-reddit-dark border border-reddit-border px-4 py-2 hover:cursor-poiner hover:border-white'>
      <div className='flex flex-col items-center'>
        <PiArrowFatUpFill
          className={classnames(
            iconBaseClassName,
            { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
            { 'text-reddit-orange': voteStatus === 'upvoted' },
            'hover:text-orange-500'
          )}
          onClick={() => handleVoteChange('upvoted')}
        />
        <span> {effectiveKarma} </span>
        <PiArrowFatDownFill
          className={classnames(
            iconBaseClassName,
            { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
            { 'text-indigo-400': voteStatus === 'downvoted' },
            'hover:text-indigo-500'
          )}
          onClick={() => handleVoteChange('downvoted')}
        />
      </div>
      <Link href={`/r/${subreddit}/comments/${id}`} className='flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-1'>
          <h1 className='text-lg'>
            {title}
          </h1>
          <div className='flex flex-row gap-x-1 text-sm'>
            <span className='font-bold'> {`r/${subreddit}`} </span>
            <span className='text-gray-400'> {`Posted by u/${author}`} </span>
          </div>
        </div>
      </Link>
    </main>
  )
}

export default PostCard