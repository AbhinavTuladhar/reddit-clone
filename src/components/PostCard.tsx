'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import classnames from 'classnames'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import { BsFlag } from 'react-icons/bs'
import { FaRegCommentAlt } from 'react-icons/fa'
import { FiBookmark } from 'react-icons/fi'
import { PiArrowFatDownFill, PiArrowFatUpFill } from 'react-icons/pi'
import { PiShareFatBold } from 'react-icons/pi'
import useSWR from 'swr'

import useVote from '@/hooks/useVote'
import { PostType, voteStatus } from '@/types/types'
import calculateDateString from '@/utils/calculateDateString'

import IconWithText from './IconWithText'

interface PostProps {
  /** The id of the post. */
  id: string
  /** Whether to view the name of the subreddit on the post card. */
  subViewFlag: boolean
}

const PostCard: React.FC<PostProps> = ({ id, subViewFlag }) => {
  const session = useSession()
  const { status, data: sessionData } = session
  const userName = sessionData?.user?.name || ''

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, mutate } = useSWR<PostType>(`/api/post/${id}`, fetcher)

  const { author = '', subreddit, title, createdAt = '', upvotedBy = [], downvotedBy = [], comments = [] } = data || {}

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
  const { voteStatus, setVoteStatus, handleVoteChange } = useVote({
    author,
    apiUrl,
    initialVoteStatus,
    mutate,
    status,
    userName,
  })

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState)
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
        'hover:text-reddit-orange',
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
        'hover:text-indigo-400',
      )}
      onClick={() => handleVoteChange('downvoted')}
      key={3}
    />,
  ]

  const rowIconClassName = 'w-5 h-5'

  const extraRowIcons = [
    <IconWithText icon={<FiBookmark className={rowIconClassName} />} text="Save" key={1} />,
    <IconWithText icon={<AiOutlineEyeInvisible className={rowIconClassName} />} text="Hide" key={2} />,
    <IconWithText icon={<BsFlag className={rowIconClassName} />} text="Report" key={3} />,
  ]

  return (
    <main className="hover:cursor-poiner flex flex-row items-center gap-x-4 border border-reddit-border bg-reddit-dark duration-150 hover:cursor-pointer hover:border-white">
      <div className="hidden h-full flex-col items-center gap-y-1 bg-[#161617] px-4 py-4 sm:flex">
        {votingDivComponents.map((component, index) => (
          <div key={index}>{component}</div>
        ))}
      </div>

      <div className="flex flex-1 flex-grow flex-col justify-between gap-y-1 py-1 pl-4 sm:pl-0">
        <Link href={postLink} className="flex w-full flex-grow flex-col justify-between gap-y-0">
          <h1 className="text-lg">{title}</h1>
          <div className="flex flex-row flex-wrap items-center gap-x-1 text-xs">
            {subViewFlag && (
              <Link href={`/r/${subreddit}`} className="font-bold hover:underline">
                {' '}
                {`r/${subreddit}`}{' '}
              </Link>
            )}
            <span className="flex flex-row text-gray-400">
              <span> Posted by&nbsp; </span>
              <Link href={`/u/${author}`} className="hover:underline">
                {' '}
                {`u/${author}`}
              </Link>
            </span>
            <span className="text-reddit-placeholder-gray"> {dateString} </span>
          </div>
        </Link>

        <div className="flex flex-row flex-wrap items-center gap-x-1">
          <div className="flex flex-row gap-x-2 sm:hidden">
            {votingDivComponents.map((component, index) => (
              <div key={index}>{component}</div>
            ))}
          </div>
          <IconWithText
            icon={<FaRegCommentAlt className={rowIconClassName} />}
            text={<Link href={postLink}>{`${comments?.length} comments`}</Link>}
          />
          <IconWithText icon={<PiShareFatBold className={rowIconClassName} />} text="Share" />
          <div className="hidden sm:flex sm:flex-row sm:gap-x-1">
            {extraRowIcons.map((icon, index) => (
              <div key={index}>{icon}</div>
            ))}
          </div>
          <div className="relative">
            <div
              className="block px-1 text-reddit-placeholder-gray duration-200 hover:cursor-pointer hover:bg-reddit-hover-gray sm:hidden"
              onClick={toggleMenu}
            >
              <BsThreeDots className={rowIconClassName} />
            </div>
            <div
              className={`${isMenuOpen ? 'opacity-100' : 'pointer-events-none  opacity-0'} absolute left-0 z-10 flex w-32 flex-col border border-reddit-border shadow shadow-reddit-white transition-opacity duration-300`}
            >
              {extraRowIcons.map((icon, index) => (
                <div className="border border-reddit-border" key={index}>
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
