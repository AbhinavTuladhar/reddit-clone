'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Profile from '../images/reddit_default_pp.png'
import { CommentType as CommentProps } from '@/types/types'
import axios from 'axios'
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'

const CommentCard: React.FC<CommentProps> = ({
  _id,
  content,
  author,
  post,
  parentComment,
  createdAt,
  replies,
  upvotedBy,
  downvotedBy,
  comments,
}) => {
  type voteStatus = 'upvoted' | 'nonvoted' | 'downvoted'

  const [voteStatus, setVoteStatus] = useState<voteStatus>('nonvoted')

  const effectiveKarma = upvotedBy?.length + downvotedBy.length === 0 ? 1 : (upvotedBy.length < downvotedBy.length ? 0 : upvotedBy.length - downvotedBy.length)

  const handleVoteChange = (targetStatus: voteStatus) => {
    if (voteStatus === targetStatus) {
      setVoteStatus('nonvoted')
    } else {
      setVoteStatus(targetStatus)
    }
  }

  const baseIconClassName = 'flex flex-row items-center w-5 h-5 text-reddit-placeholder-gray hover:cursor-pointer hover:bg-reddit-hover-gray'

  return (
    <main className='flex flex-row gap-x-4'>
      <Image
        src={Profile}
        alt='profile pic'
        className='rounded-full h-8 w-8'
      />
      <section className='flex flex-col gap-y-1'>
        <Link href={`/u/${author}`} className='text-sm hover:underline tracking-tight'> {author} </Link>
        <section>
          {content}
        </section>
        <div className='flex flex-row gap-x-2'>
          <PiArrowFatUpFill
            className={`${baseIconClassName} ${voteStatus === 'upvoted' && 'text-red-500'} hover:text-red-500`}
            onClick={() => handleVoteChange('upvoted')}
          />
          <span className='text-sm'>
            {effectiveKarma}
          </span>
          <PiArrowFatDownFill
            className={`${baseIconClassName} ${voteStatus === 'downvoted' && 'text-blue-600'} hover:text-blue-500`}
            onClick={() => handleVoteChange('downvoted')}
          />
        </div>
      </section>
    </main>
  )
}

export default CommentCard
