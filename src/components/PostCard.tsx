'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import { FaRegCommentAlt } from 'react-icons/fa'
import { PiShareFatBold } from 'react-icons/pi'
import { FiBookmark } from 'react-icons/fi'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import useSWR from 'swr';
import classnames from 'classnames';
import { useSession } from 'next-auth/react';
import { BsFlag } from 'react-icons/bs'
import { PostType, voteStatus } from '@/types/types'
import calculateDateString from '@/utils/calculateDateString';
import IconWithText from './IconWithText';
import useVote from '@/hooks/useVote';

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
  const apiUrl = `/api/post/${id}`
  const { voteStatus, setVoteStatus, handleVoteChange } = useVote({ author, apiUrl, initialVoteStatus, mutate, status, userName })

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  useEffect(() => {
    setVoteStatus(initialVoteStatus)
  }, [initialVoteStatus, setVoteStatus])

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1
  const dateString = calculateDateString(new Date(createdAt), new Date())
  const postLink = `/r/${subreddit}/comments/${id}`

  const iconBaseClassName = 'w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'
  const votingDivComponents = [
    <PiArrowFatUpFill
      className={classnames(
        iconBaseClassName,
        { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
        { 'text-reddit-orange': voteStatus === 'upvoted' },
        'hover:text-reddit-orange'
      )}
      onClick={() => handleVoteChange('upvoted')}
      key={1}
    />,
    <span
      className={classnames(
        { 'text-reddit-placeholder-gray': voteStatus === 'nonvoted' },
        { 'text-reddit-orange': voteStatus === 'upvoted' },
        { 'text-indigo-400': voteStatus === 'downvoted' },
      )}
      key={2}
    >
      {effectiveKarma}
    </span>,
    <PiArrowFatDownFill
      className={classnames(
        iconBaseClassName,
        { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
        { 'text-indigo-400': voteStatus === 'downvoted' },
        'hover:text-indigo-400'
      )}
      onClick={() => handleVoteChange('downvoted')}
      key={3}
    />
  ]

  const rowIconClassName = 'w-5 h-5'

  const extraRowIcons = [
    <IconWithText
      icon={<FiBookmark className={rowIconClassName} />}
      text='Save'
      key={1}
    />,
    <IconWithText
      icon={<AiOutlineEyeInvisible className={rowIconClassName} />}
      text='Hide'
      key={2}
    />,
    <IconWithText
      icon={<BsFlag className={rowIconClassName} />}
      text='Report'
      key={3}
    />
  ]

  return (
    <main className='flex flex-row items-center duration-150 border gap-x-4 bg-reddit-dark border-reddit-border hover:cursor-poiner hover:border-white hover:cursor-pointer'>

      <div className='hidden sm:flex flex-col items-center bg-[#161617] px-4 py-4 h-full gap-y-1'>
        {votingDivComponents.map((component, index) => (
          <div key={index}>
            {component}
          </div>
        ))}
      </div>

      <div className='flex flex-col justify-between flex-1 flex-grow py-1 pl-4 gap-y-1 sm:pl-0'>
        <Link href={postLink} className='flex flex-col justify-between flex-grow w-full gap-y-0'>
          <h1 className='text-lg'>
            {title}
          </h1>
          <div className='flex flex-row flex-wrap items-center text-xs gap-x-1'>
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

        <div className='flex flex-row flex-wrap items-center gap-x-1'>
          <div className='flex flex-row gap-x-2 sm:hidden'>
            {votingDivComponents.map((component, index) => (
              <div key={index}>
                {component}
              </div>
            ))}
          </div>
          <IconWithText
            icon={<FaRegCommentAlt className={rowIconClassName} />}
            text={
              <Link href={postLink}>
                {`${comments?.length} comments`}
              </Link>
            }
          />
          <IconWithText
            icon={<PiShareFatBold className={rowIconClassName} />}
            text='Share'
          />
          <div className='hidden sm:flex sm:flex-row sm:gap-x-1'>
            {extraRowIcons.map((icon, index) => (
              <div key={index}>
                {icon}
              </div>
            ))}
          </div>
          <div className='relative'>
            <div
              className='block px-1 duration-200 sm:hidden text-reddit-placeholder-gray hover:bg-reddit-hover-gray hover:cursor-pointer'
              onClick={toggleMenu}
            >
              <BsThreeDots className={rowIconClassName} />
            </div>
            <div className={`${isMenuOpen ? 'opacity-100' : 'opacity-0  pointer-events-none'} transition-opacity duration-300 absolute left-0 z-10 flex flex-col w-32 border shadow border-reddit-border shadow-reddit-white`}>
              {extraRowIcons.map((icon, index) => (
                <div className='border border-reddit-border' key={index}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default PostCard