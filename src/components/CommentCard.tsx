'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import useSWR from 'swr'
import Profile from '../images/reddit_default_pp.png'
import { CommentType, voteStatus } from '@/types/types'
import calculateDateString from '@/utils/calculateDateString'
import useCommentVote from '../hooks/useCommentVote';
import CommentActions from './CommentActions'
import ReplyForm from './ReplyForm'

interface CommentProps {
  id: string,
  postAuthor?: string,
  showReply: boolean
}

const CommentCard: React.FC<CommentProps> = ({ id, postAuthor, showReply }) => {
  const session = useSession()

  const { status, data: sessionData } = session
  const userName = sessionData?.user?.name || ''

  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, mutate } = useSWR<CommentType>(`/api/comment/${id}`, fetcher)

  const {
    author,
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

  const { voteStatus, setVoteStatus, handleVoteChange } = useCommentVote({ author, id, initialVoteStatus, mutate, status, userName })

  const [reply, setReply] = useState('')
  const [replyFlag, setReplyFlag] = useState(false)

  useEffect(() => {
    setVoteStatus(initialVoteStatus)
  }, [initialVoteStatus])

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1
  const dateString = calculateDateString(new Date(createdAt), new Date())
  const paragraphs = content?.split('\n')

  const toggleReplyVisibility = () => {
    setReplyFlag(prevFlag => !prevFlag)
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

  return (
    <div className={`${parentComment !== null && 'pl-4'} flex flex-col`}>
      <main className='flex flex-row mt-2 gap-x-4'>
        <section className='flex flex-col flex-1 gap-y-1'>
          <div className='flex flex-row items-center text-xs gap-x-2'>
            <Image
              src={Profile}
              alt='profile pic'
              className='w-8 h-8 rounded-full'
            />
            <Link href={`/u/${author}`} className='tracking-tight hover:underline'> {author} </Link>
            {postAuthor === author && (
              <span className='font-bold text-blue-600'> OP </span>
            )}
            <span className='text-reddit-placeholder-gray'> {dateString} </span>
          </div>
          <section className='flex flex-col pl-6 ml-4 border-l-2 border-reddit-comment-line gap-y-1'>
            <div>
              {paragraphs?.map((row) => (
                <>
                  {row} <br />
                </>
              ))}
            </div>
            <CommentActions sameUser={author === userName} effectiveKarma={effectiveKarma} handleVoteChange={handleVoteChange} toggleReplyVisibility={toggleReplyVisibility} voteStatus={voteStatus} />
          </section>
          <>
            {replyFlag && (
              <div className='w-full m-2'>
                <ReplyForm reply={reply} setReply={setReply} handleSubmit={handleSubmit} toggleReplyVisibility={toggleReplyVisibility} />
              </div>
            )}
          </>
        </section>
      </main>

      {showReply && replies?.map(reply => (
        <>
          <section className='pl-0 ml-4 border-l-2 border-reddit-comment-line'>
            <CommentCard id={reply} postAuthor={postAuthor} showReply={true} />
          </section>
        </>
      ))}

    </div>
  )
}

export default CommentCard
