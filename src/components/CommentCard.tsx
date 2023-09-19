'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Profile from '../images/reddit_default_pp.png'
import { CommentType, voteStatus, VotingRequestBody } from '@/types/types'
import axios from 'axios'
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import useSWR from 'swr'
import classnames from 'classnames'
import { useSession } from 'next-auth/react'
import calculateDateString from '@/utils/calculateDateString'

interface CommentProps {
  id: string
}

const CommentCard: React.FC<CommentProps> = ({
  id,
}) => {
  const session = useSession()

  const { status, data: sessionData } = session
  const userName = sessionData?.user?.name || ''

  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, mutate } = useSWR<CommentType>(`/api/comment/${id}`, fetcher)

  const {
    author,
    comments,
    content,
    createdAt = '',
    downvotedBy = [],
    parentComment,
    post,
    replies,
    upvotedBy = []
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

    await axios.patch(`/api/comment/${id}`, requestBody)
    mutate()
  }

  const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

  return (
    <main className='flex flex-row gap-x-4'>
      <Image
        src={Profile}
        alt='profile pic'
        className='w-8 h-8 rounded-full'
      />
      <section className='flex flex-col gap-y-1'>
        <div className='flex flex-row items-center gap-x-2'>
          <Link href={`/u/${author}`} className='text-sm tracking-tight hover:underline'> {author} </Link>
          <span className='text-sm text-reddit-placeholder-gray'> {dateString} </span>
        </div>
        <section>
          {content}
        </section>
        <div className='flex flex-row gap-x-2'>
          <PiArrowFatUpFill
            className={classnames(
              baseIconClassName,
              { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
              { 'text-reddit-orange': voteStatus === 'upvoted' },
              'hover:text-reddit-orange'
            )}
            onClick={() => handleVoteChange('upvoted')}
          />
          <span
            className={classnames(
              'w-3 text-sm text-center',
              { 'text-reddit-placeholder-gray': voteStatus === 'nonvoted' },
              { 'text-reddit-orange': voteStatus === 'upvoted' },
              { 'text-indigo-400': voteStatus === 'downvoted' },
            )}
          >
            {effectiveKarma}
          </span>
          <PiArrowFatDownFill
            className={classnames(
              baseIconClassName,
              { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
              { 'text-indigo-400': voteStatus === 'downvoted' },
              'hover:text-indigo-400'
            )}
            onClick={() => handleVoteChange('downvoted')}
          />
        </div>
      </section>
    </main>
  )
}

export default CommentCard
