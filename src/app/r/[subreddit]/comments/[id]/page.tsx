'use client'

import React, { useState, useEffect } from 'react'
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import { PostType, voteStatus } from '@/types/types'
import { Types } from 'mongoose'
import axios from 'axios'
import Link from 'next/link'
import { FaRegCommentAlt } from 'react-icons/fa'
import { FiGift } from 'react-icons/fi'
import { PiShareFatBold } from 'react-icons/pi'
import { useSession } from 'next-auth/react'
import CommentCard from '@/components/CommentCard'
import useSWR from 'swr'
import classnames from 'classnames'
import calculateDateString from '@/utils/calculateDateString'
import AboutCommunity from '@/components/AboutCommunity'
import useVote from '@/hooks/useVote'

interface SubredditCommentParams {
  params: {
    subreddit: string
    id: string
  }
}

interface PostWithId extends PostType {
  _id: Types.ObjectId
  topLevelComments: Types.ObjectId[]
}

const Page: React.FC<SubredditCommentParams> = ({ params }) => {
  const subredditName = params.subreddit
  const postId = params.id

  const session = useSession()

  const [comment, setComment] = useState<string>('')
  const [commentData, setCommentData] = useState<string[]>([])

  const status = session?.status
  const userName = session?.data?.user?.name || ''

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, mutate } = useSWR<PostWithId | null>(`/api/post/${postId}`, fetcher)

  const {
    _id,
    author,
    subreddit,
    title,
    body,
    createdAt = '',
    upvotedBy = [],
    downvotedBy = [],
    comments,
    topLevelComments = [],
  } = data || {}

  const iconClassName = 'text-reddit-placeholder-gray font-bold w-5 h-5'

  const iconBarData = [
    {
      icon: <FaRegCommentAlt className={iconClassName} />,
      label: `${comments?.length || 0} comments`,
    },
    { icon: <FiGift className={iconClassName} />, label: 'Award' },
    { icon: <PiShareFatBold className={iconClassName} />, label: 'Share' },
  ]

  // Check if the user is in the upvote or downvotedby list in the comment
  let initialVoteStatus: voteStatus = 'nonvoted'

  if (upvotedBy.includes(userName) || author === userName) {
    initialVoteStatus = 'upvoted'
  } else if (downvotedBy.includes(userName)) {
    initialVoteStatus = 'downvoted'
  } else {
    initialVoteStatus = 'nonvoted'
  }

  const apiUrl = `/api/post/${_id}`
  const { voteStatus, setVoteStatus, handleVoteChange } = useVote({
    author,
    apiUrl,
    initialVoteStatus,
    mutate,
    status,
    userName,
  })

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1
  const dateString = calculateDateString(new Date(createdAt), new Date())
  const paragraphs = body?.split('\n')

  useEffect(() => {
    setVoteStatus(initialVoteStatus)
  }, [initialVoteStatus, setVoteStatus])

  // For fethcing the comments
  useEffect(() => {
    if (comments?.length === 0 || !comments) {
      return
    }

    setCommentData(topLevelComments.map((comment) => comment.toString()))
  }, [topLevelComments, comments])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event
    setComment(value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody = {
      content: comment,
      author: userName,
      post: postId,
    }

    await axios.post('/api/comment', requestBody)
    setComment('')
    mutate()
  }

  const commentForm = (
    <form className="my-2 flex flex-1 flex-col gap-y-2" onSubmit={handleSubmit}>
      <span className="text-sm">
        Comment as&nbsp;
        <Link href={`/u/${userName}`} className="text-blue-500 duration-300 hover:text-red-500 hover:underline">
          {userName}
        </Link>
      </span>
      <textarea
        className="h-32 max-w-full resize-none border-[1px] border-reddit-border bg-reddit-dark px-4 py-2 placeholder:text-reddit-placeholder-gray"
        placeholder="What are your thoughts?"
        onChange={handleChange}
        value={comment}
      />
      <div className="-mt-1.5 flex flex-row justify-end bg-reddit-gray px-2 py-1">
        <button
          className="rounded-full bg-white px-2 py-1 text-sm enabled:text-black disabled:text-gray-400 disabled:hover:cursor-not-allowed"
          disabled={comment === ''}
        >
          Comment
        </button>
      </div>
    </form>
  )

  const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

  return (
    <main className="mt-4 flex flex-col gap-4 lg:flex-row">
      <section className="mx-auto flex w-full flex-1 flex-col gap-y-6 border border-reddit-border bg-reddit-dark px-2 py-4 md:px-4">
        <div className="flex flex-row gap-x-4">
          <section className="flex flex-col items-center gap-y-1">
            <PiArrowFatUpFill
              className={classnames(
                baseIconClassName,
                { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
                { 'text-reddit-orange': voteStatus === 'upvoted' },
                'hover:text-reddit-orange',
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
                baseIconClassName,
                { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
                { 'text-indigo-400': voteStatus === 'downvoted' },
                'hover:text-indigo-400',
              )}
              onClick={() => handleVoteChange('downvoted')}
            />
          </section>
          <section className="flex flex-1 flex-col gap-y-2">
            <div className="flex flex-row flex-wrap items-center gap-x-1 text-xs text-gray-400">
              <Link className="font-bold text-white duration-300 hover:underline" href={`/r/${subreddit}`}>
                {' '}
                {`r/${subreddit}`}
              </Link>
              <span> Posted by </span>
              <Link href={`/u/${author}`} className="duration-300 hover:underline">
                {' '}
                {`u/${author}`}{' '}
              </Link>
              <span> {dateString} </span>
            </div>
            <h1 className="text-xl font-bold">{title}</h1>
            {paragraphs?.map((row, index) => (
              <div key={index}>
                {row} <br />
              </div>
            ))}

            <section className="flex flex-row gap-x-2">
              {iconBarData.map((row, index) => (
                <div
                  className="flex flex-row items-center gap-x-2 p-2 duration-300 hover:cursor-pointer hover:bg-reddit-hover-gray"
                  key={index}
                >
                  <span> {row.icon} </span>
                  <span className="text-reddit-placeholder-gray"> {row.label} </span>
                </div>
              ))}
            </section>

            <>{status === 'authenticated' && commentForm}</>
          </section>
        </div>

        <div className="flex items-center py-5">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="ml-4 flex flex-shrink justify-end text-white"> {comments?.length} comments </span>
        </div>

        <>
          {commentData?.map((comment, index) => (
            <CommentCard _id={comment} postAuthor={author || ''} showReply={true} key={index} />
          ))}
        </>
      </section>

      <section className="w-full lg:w-80">
        <div className="sticky top-16">
          <AboutCommunity subName={subredditName} />
        </div>
      </section>
    </main>
  )
}

export default Page
