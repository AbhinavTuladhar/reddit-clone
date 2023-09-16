'use client'

import React, { useState } from 'react'
import Link from 'next/link';
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import { PostType as PostProps, voteStatus } from '@/types/types'

const PostCard: React.FC<PostProps> = ({
  _id,
  author,
  subreddit,
  title,
  body = '',
  createdAt,
  upvotedBy,
  downvotedBy,
  comments,
}) => {

  const [voteStatus, setVoteStatus] = useState<voteStatus>('nonvoted')

  const effectiveKarma = upvotedBy?.length + downvotedBy.length === 0 ? 1 : (upvotedBy.length < downvotedBy.length ? 0 : upvotedBy.length - downvotedBy.length)

  const handleVoteChange = (targetStatus: voteStatus) => {
    if (voteStatus === targetStatus) {
      setVoteStatus('nonvoted')
    } else {
      setVoteStatus(targetStatus)
    }
  }

  const iconBaseClassName = 'w-5 h-5 text-reddit-placeholder-gray hover:cursor-pointer hover:bg-reddit-hover-gray'

  return (
    <main className='flex flex-row items-center gap-x-4 bg-reddit-dark border border-reddit-border px-4 py-2 hover:cursor-poiner hover:border-white'>
      <div className='flex flex-col items-center'>
        <PiArrowFatUpFill className={`${iconBaseClassName} ${voteStatus === 'upvoted' && 'text-red-500'} hover:text-red-500`} onClick={() => handleVoteChange('upvoted')} />
        <span> {effectiveKarma} </span>
        <PiArrowFatDownFill className={`${iconBaseClassName} ${voteStatus === 'downvoted' && 'text-blue-500'} hover:text-blue-500`} onClick={() => handleVoteChange('downvoted')} />
      </div>
      <Link href={`/r/${subreddit}/${_id}`} className='flex flex-col gap-y-4'>
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