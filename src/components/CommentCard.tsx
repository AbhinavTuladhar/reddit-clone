'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Profile from '../images/reddit_default_pp.png'
import { CommentType, voteStatus, VotingRequestBody } from '@/types/types'
import axios from 'axios'
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import { FaRegCommentAlt } from 'react-icons/fa'
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

  if (upvotedBy?.includes(userName) || userName === author) {
    initialVoteStatus = 'upvoted'
  } else if (downvotedBy?.includes(userName)) {
    initialVoteStatus = 'downvoted'
  } else {
    initialVoteStatus = 'nonvoted'
  }

  const [voteStatus, setVoteStatus] = useState<voteStatus>(initialVoteStatus)
  const [reply, setReply] = useState('')
  const [replyFlag, setReplyFlag] = useState(false)

  useEffect(() => {
    setVoteStatus(initialVoteStatus)
  }, [initialVoteStatus])

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1
  const dateString = calculateDateString(new Date(createdAt), new Date())
  const paragraphs = content?.split('\n')

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

    await axios.patch(`/api/comment/${id}`, requestBody)
    mutate()
  }


  const toggleReplyVisibility = () => {
    setReplyFlag(prevFlag => !prevFlag)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target: { value } } = event
    setReply(value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody = {
      content: reply,
      author: userName,
      post,
      parentComment: id     // This is the id of the current comment
    }
    await axios.post('/api/comment', requestBody)
    setReply('')
    mutate()
    toggleReplyVisibility()
  }

  const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

  const commentForm = (
    <form className='flex flex-col flex-1 gap-y-2' onSubmit={handleSubmit}>
      <textarea
        className='w-full px-4 py-2 h-32 border-[1px] border-reddit-border bg-reddit-dark resize-none placeholder:text-reddit-placeholder-gray'
        placeholder='What are your thoughts?'
        onChange={handleChange}
        value={reply}
      />
      <div className='bg-reddit-gray -mt-1.5 px-2 py-1 flex flex-row gap-x-3 justify-end'>
        <button
          className='px-2 py-1 text-sm text-white rounded-full hover:bg-reddit-hover-gray'
          onClick={() => toggleReplyVisibility()}
        >
          Cancel
        </button>
        <button
          className='px-2 py-1 text-sm bg-white rounded-full disabled:text-gray-400 enabled:text-black disabled:hover:cursor-not-allowed'
          disabled={reply === ''}
          type='submit'
        >
          Comment
        </button>
      </div>
    </form>
  )

  return (
    <div className='flex flex-col gap-y-2'>
      <main className='flex flex-row gap-x-4'>
        <div className='flex flex-col items-center justify-center gap-y-1'>
          <Image
            src={Profile}
            alt='profile pic'
            className='w-6 h-6 rounded-full'
          />
          <div className='h-full mt-1 text-xs text-transparent border-l-2 w-fit border-reddit-comment-line hover:border-slate-100 hover:cursor-pointer'> </div>
        </div>
        <section className='flex flex-col flex-1 gap-y-1'>
          <div className='flex flex-row items-center gap-x-2'>
            <Link href={`/u/${author}`} className='text-sm tracking-tight hover:underline'> {author} </Link>
            <span className='text-sm text-reddit-placeholder-gray'> {dateString} </span>
          </div>
          <section>
            {paragraphs?.map((row) => (
              <>
                {row} <br />
              </>
            ))}
          </section>
          <div className='flex flex-row items-center gap-x-2'>
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
            <div
              className={`${baseIconClassName} w-fit px-2 py-4 flex flex-row items-center gap-x-2 text-reddit-placeholder-gray`}
              onClick={() => toggleReplyVisibility()}
            >
              <FaRegCommentAlt className='w-4 h-4' />
              <span className='text-sm'> Reply </span>
            </div>
          </div>

          <>
            {replyFlag && (
              <div className='w-full m-2'>
                {commentForm}
              </div>
            )}
          </>

        </section>
      </main>

      {replies?.map(reply => (
        <>
          {/* <div className='h-full mt-1 text-xs text-transparent border-l-2 w-fit border-reddit-comment-line hover:border-slate-100 hover:cursor-pointer'> </div> */}
          <section className='ml-5'>
            <CommentCard id={reply} />
          </section>
        </>
      ))}

    </div>
  )
}

export default CommentCard
