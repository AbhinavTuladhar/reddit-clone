'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import { PostType, voteStatus } from '@/types/types'
import useSWR from 'swr';
import classnames from 'classnames';
import calculateDateString from '@/utils/calculateDateString';
import { useSession } from 'next-auth/react';
import axios from 'axios'
import { FaRegCommentAlt } from 'react-icons/fa'
import { PiShareFatBold } from 'react-icons/pi'
import { FiBookmark } from 'react-icons/fi'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { BsFlag } from 'react-icons/bs'

interface PostProps {
  /** The id of the post. */
  id: string,
  /** Whether to view the name of the subreddit on the post card. */
  subViewFlag: boolean
}

const PostCard: React.FC<PostProps> = ({ id, subViewFlag }) => {
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
    comments = []
  } = data || {}

  // Check if the user is in the upvote or downvotedby list in the comment
  let initialVoteStatus: voteStatus

  if (upvotedBy.includes(userName) || author === userName) {
    initialVoteStatus = 'upvoted'
  } else if (downvotedBy.includes(userName)) {
    initialVoteStatus = 'downvoted'
  } else {
    initialVoteStatus = 'nonvoted'
  }

  const [voteStatus, setVoteStatus] = useState<voteStatus>(initialVoteStatus)

  useEffect(() => {
    setVoteStatus(initialVoteStatus)
  }, [initialVoteStatus])

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1
  const dateString = calculateDateString(new Date(createdAt), new Date())
  const postLink = `/r/${subreddit}/comments/${id}`


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

    const requestBody = { user: userName, voteTarget: newVoteStatus, author: author }

    await axios.patch(`/api/post/${id}`, requestBody)
    mutate()
  }

  const iconBaseClassName = 'w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'
  const votingDiv = (
    <div className='flex flex-col items-center bg-[#161617] px-4 py-4 h-full gap-y-1'>
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
  )

  const rowIconClassName = 'w-5 h-5'
  const iconData = [
    { icon: <FaRegCommentAlt className={rowIconClassName} />, text: `${comments?.length} comments`, key: 'comment' },
    { icon: <PiShareFatBold className={rowIconClassName} />, text: 'Share', key: 'share' },
    { icon: <FiBookmark className={rowIconClassName} />, text: 'Save', key: 'save' },
    { icon: <AiOutlineEyeInvisible className={rowIconClassName} />, text: 'Hide', key: 'hide' },
    { icon: <BsFlag className={rowIconClassName} />, text: 'Report', key: 'report' },
  ]
  const handleClick = (event: React.MouseEvent<HTMLDivElement | MouseEvent>) => {
    event.stopPropagation()
    // event.preventDefault()
  }
  const rowIconDiv = (
    <div className='flex flex-row flex-wrap gap-x-1 lg:gap-x-2'>
      {iconData?.map(iconRow => {
        const { icon, text, key } = iconRow
        const iconDataClassName = 'flex flex-row items-center px-1 py-2 gap-x-1 text-reddit-placeholder-gray hover:bg-reddit-hover-gray hover:cursor-pointer'

        if (key === 'comment') {
          return (
            <Link href={postLink} className={iconDataClassName}>
              <> {icon} </>
              <span> {text} </span>
            </Link>
          )
        }

        return (
          <div className={iconDataClassName} onClick={(e) => e.stopPropagation()}>
            <> {icon} </>
            <span> {text} </span>
          </div>
        )
      })}
      <Link href={postLink} className='flex flex-grow'> </Link>
    </div>
  )

  return (
    <main className='flex flex-row items-center border gap-x-4 bg-reddit-dark border-reddit-border hover:cursor-poiner hover:border-white hover:cursor-pointer duration-150'>

      <> {votingDiv} </>

      <div className='flex flex-col justify-between py-1 gap-y-1 flex-grow flex-1'>
        <Link href={postLink} className='flex flex-col justify-between gap-y-0  w-full flex-grow'>
          <h1 className='text-lg'>
            {title}
          </h1>
          <div className='flex flex-row items-center text-xs gap-x-1'>
            {subViewFlag && (
              <Link href={`/r/${subreddit}`} className='font-bold hover:underline'> {`r/${subreddit}`} </Link>
            )}
            <span className='flex flex-row text-gray-400'>
              <span> Posted by&nbsp; </span>
              <Link href={`/u/${author}`} className='hover:underline'> {`u/${author}`}</Link>
            </span>
            <span className='text-reddit-placeholder-gray'> {dateString} </span>
          </div>
        </Link>

        <>{rowIconDiv} </>

      </div>
    </main>
  )
}

export default PostCard