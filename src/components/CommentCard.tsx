'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import useSWR from 'swr'
import Profile from '../images/reddit_default_pp.png'
import { CommentType, voteStatus, CommentEditBody } from '@/types/types'
import calculateDateString from '@/utils/calculateDateString'
import useVote from '../hooks/useVote';
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
    content = '',
    createdAt = '',
    downvotedBy = [],
    parentComment,
    post,
    replies,
    upvotedBy = [],
    editedFlag,
    editedAt = ''
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

  // The api endpoint which deals with voting.
  const apiUrl = `/api/comment/${id}`
  const { voteStatus, setVoteStatus, handleVoteChange } = useVote({ author, apiUrl, initialVoteStatus, mutate, status, userName })

  const [isEditing, setIsEditing] = useState(false)
  const [editedComment, setEditedComment] = useState(content)
  const [reply, setReply] = useState('')
  const [replyFlag, setReplyFlag] = useState(false)

  useEffect(() => {
    setVoteStatus(initialVoteStatus)
  }, [initialVoteStatus])

  useEffect(() => {
    setEditedComment(content)
  }, [content])

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1
  const dateString = calculateDateString(new Date(createdAt), new Date())
  const editedDateString = calculateDateString(new Date(editedAt), new Date())
  const paragraphs = content?.split('\n')

  const handleEditedCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target: { value } } = event
    setEditedComment(value)
  }

  const toggleReplyVisibility = () => {
    setReplyFlag(prevFlag => !prevFlag)
  }

  const toggleEditing = () => {
    setIsEditing(prevFlag => !prevFlag)
  }

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody: CommentEditBody = {
      content: editedComment,
      userName: userName
    }
    await axios.patch(`/api/comment/${id}/edit`, requestBody)
    mutate()
    toggleEditing()
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

  const editingForm = (
    <form className='flex flex-col flex-1 gap-y-2' onSubmit={handleEditSubmit}>
      <textarea
        className='w-full px-4 py-2 h-32 border-[1px] border-reddit-border bg-reddit-dark resize-none placeholder:text-reddit-placeholder-gray'
        placeholder='What are your thoughts?'
        value={editedComment}
        onChange={handleEditedCommentChange}
      />
      <div className='bg-reddit-gray -mt-1.5 px-2 py-1 flex flex-row gap-x-3 justify-end'>
        <button
          className='px-2 py-1 text-sm text-white rounded-full hover:bg-reddit-hover-gray'
          onClick={() => {
            toggleEditing()
            setEditedComment(content)
          }}
        >
          Cancel
        </button>
        <button
          className='px-2 py-1 text-sm bg-white rounded-full disabled:text-gray-400 enabled:text-black disabled:hover:cursor-not-allowed'
          disabled={editedComment === ''}
          type='submit'
        >
          Save edits
        </button>
      </div>
    </form>
  )

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
            <Link href={`/u/${author}`} className='tracking-tight hover:underline font-bold'> {author} </Link>
            {postAuthor === author && (
              <span className='font-bold text-blue-600'> OP </span>
            )}
            <span className='text-reddit-placeholder-gray'> · </span>
            <span className='text-reddit-placeholder-gray'> {dateString} </span>
            {editedFlag && (
              <>
                <span className='text-reddit-placeholder-gray'> · </span>
                <span className='text-reddit-placeholder-gray italic'> {`edited ${editedDateString}`} </span>
              </>
            )}
          </div>
          <section className='flex flex-col pl-6 ml-4 border-l-2 border-reddit-comment-line gap-y-1'>
            <div>
              {isEditing ? (
                editingForm
              ) : (
                paragraphs?.map((row) => (
                  <>
                    {row} <br />
                  </>
                ))
              )}
            </div>
            {!isEditing && <CommentActions toggleEditing={toggleEditing} sameUser={author === userName} effectiveKarma={effectiveKarma} handleVoteChange={handleVoteChange} toggleReplyVisibility={toggleReplyVisibility} voteStatus={voteStatus} />}
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
