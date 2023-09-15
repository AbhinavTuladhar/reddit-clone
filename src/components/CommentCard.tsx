'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Profile from '../images/reddit_default_pp.png'
import { CommentType } from '@/types/types'
import axios from 'axios'
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import useSWR from 'swr'

interface CommentProps {
  id: string
}

const CommentCard: React.FC<CommentProps> = ({
  id,
}) => {
  type voteStatus = 'upvoted' | 'nonvoted' | 'downvoted'
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, mutate } = useSWR<CommentType>(`/api/comment/${id}`, fetcher)

  const {
    author,
    comments,
    content,
    createdAt,
    downvotedBy = [],
    parentComment,
    post,
    replies,
    upvotedBy = []
  } = data || {}

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
            className={`${baseIconClassName} ${voteStatus === 'upvoted' && 'text-red-400'} hover:text-red-500`}
            onClick={() => handleVoteChange('upvoted')}
          />
          <span className='text-sm'>
            {effectiveKarma}
          </span>
          <PiArrowFatDownFill
            className={`${baseIconClassName} ${voteStatus === 'downvoted' && 'text-blue-400'} hover:text-blue-500`}
            onClick={() => handleVoteChange('downvoted')}
          />
        </div>
      </section>
    </main>
  )
}

export default CommentCard
