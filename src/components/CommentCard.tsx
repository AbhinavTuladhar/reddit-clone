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
    createdAt,
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

  console.log(`The initial vote status for ${content} is ${initialVoteStatus}`)
  console.log('The upvoted list is ', upvotedBy)
  console.log('The downvoted list is ', downvotedBy)

  const [voteStatus, setVoteStatus] = useState<voteStatus>(initialVoteStatus)

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1

  const handleVoteChange = async (targetStatus: voteStatus) => {
    if (status !== 'authenticated') {
      alert('Please login to vote.')
      return
    }

    if (voteStatus === targetStatus && targetStatus === 'upvoted') {      // Upvoted, click upvote again, case 2
      const UpvoteRemoveRequestBody: VotingRequestBody = {
        user: userName, voteTarget: 'nonvoted'
      }
      await axios.patch(`/api/comment/${id}`, UpvoteRemoveRequestBody)
      mutate()
      setVoteStatus('nonvoted')
    } else if (voteStatus === targetStatus && targetStatus === 'downvoted') { // Downvoted, click downvote again, case 3
      const DownvoteRemoveRequestBody: VotingRequestBody = {
        user: userName, voteTarget: 'nonvoted'
      }
      await axios.patch(`/api/comment/${id}`, DownvoteRemoveRequestBody)
      mutate()
      setVoteStatus('nonvoted')
    } else if (targetStatus === 'upvoted' && voteStatus === 'nonvoted') { // Case 1
      const upvoteRequestBody: VotingRequestBody = {
        user: userName, voteTarget: 'upvoted'
      }
      await axios.patch(`/api/comment/${id}`, upvoteRequestBody)
      mutate()
      setVoteStatus('upvoted')
    } else if (targetStatus === 'downvoted' && voteStatus === 'nonvoted') { // Case 1
      const downvoteRequestBody: VotingRequestBody = {
        user: userName, voteTarget: 'downvoted'
      }
      await axios.patch(`/api/comment/${id}`, downvoteRequestBody)
      mutate()
      setVoteStatus('downvoted')
    } else if (targetStatus === 'downvoted' && voteStatus === 'upvoted') {  // Case 4
      const downvoteRequestBody: VotingRequestBody = {
        user: userName, voteTarget: 'downvoted'
      }
      await axios.patch(`/api/comment/${id}`, downvoteRequestBody)
      mutate()
      setVoteStatus('downvoted')
    } else if (targetStatus === 'upvoted' && voteStatus === 'downvoted') {  // Case 5
      const upvoteRequestBody: VotingRequestBody = {
        user: userName, voteTarget: 'upvoted'
      }
      await axios.patch(`/api/comment/${id}`, upvoteRequestBody)
      mutate()
      setVoteStatus('upvoted')
    }
  }

  useEffect(() => {
    console.log(`The status for comment with content of ${content} is ${voteStatus}`)
  }, [content, voteStatus])

  const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

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
            className={classnames(
              baseIconClassName,
              { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
              { 'text-reddit-orange': voteStatus === 'upvoted' },
              'hover:text-orange-500'
            )}
            onClick={() => handleVoteChange('upvoted')}
          />
          <span className='text-sm'>
            {effectiveKarma}
          </span>
          <PiArrowFatDownFill
            className={classnames(
              baseIconClassName,
              { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
              { 'text-indigo-400': voteStatus === 'downvoted' },
              'hover:text-indigo-500'
            )}
            onClick={() => handleVoteChange('downvoted')}
          />
        </div>
      </section>
    </main>
  )
}

export default CommentCard
