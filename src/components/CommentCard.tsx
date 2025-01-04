'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import useSWR from 'swr'

import { CommentEditBody, CommentType, voteStatus } from '@/types/types'
import calculateDateString from '@/utils/calculateDateString'

import useVote from '../hooks/useVote'
import Profile from '../images/reddit_default_pp.png'

import CommentActions from './CommentActions'
import ReplyForm from './ReplyForm'

interface CommentProps {
  _id: string
  postAuthor?: string
  showReply: boolean
}

const CommentCard: React.FC<CommentProps> = ({ _id, postAuthor, showReply }) => {
  const session = useSession()

  const { status, data: sessionData } = session
  const userName = sessionData?.user?.name || ''

  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, mutate } = useSWR<CommentType>(`/api/comment/${_id}`, fetcher)

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
    editedAt = '',
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
  const apiUrl = `/api/comment/${_id}`
  const { voteStatus, setVoteStatus, handleVoteChange } = useVote({
    author,
    apiUrl,
    initialVoteStatus,
    mutate,
    status,
    userName,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedComment, setEditedComment] = useState(content)
  const [reply, setReply] = useState('')
  const [replyFlag, setReplyFlag] = useState(false)

  useEffect(() => {
    setVoteStatus(initialVoteStatus)
  }, [initialVoteStatus, setVoteStatus])

  useEffect(() => {
    setEditedComment(content)
  }, [content])

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1
  const dateString = calculateDateString(new Date(createdAt), new Date())
  const editedDateString = calculateDateString(new Date(editedAt), new Date())
  const paragraphs = content?.split('\n')

  const handleEditedCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event
    setEditedComment(value)
  }

  const toggleReplyVisibility = () => {
    setReplyFlag((prevFlag) => !prevFlag)
  }

  const toggleEditing = () => {
    setIsEditing((prevFlag) => !prevFlag)
  }

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody: CommentEditBody = {
      content: editedComment,
      userName: userName,
    }
    await axios.patch(`/api/comment/${_id}/edit`, requestBody)
    mutate()
    toggleEditing()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody = {
      content: reply,
      author: userName,
      post,
      parentComment: _id, // This is the id of the current comment
    }
    await axios.post('/api/comment', requestBody)
    setReply('')
    mutate()
    toggleReplyVisibility()
  }

  const editingForm = (
    <form className="flex flex-1 flex-col gap-y-2" onSubmit={handleEditSubmit}>
      <textarea
        className="h-32 w-full resize-none border-[1px] border-reddit-border bg-reddit-dark px-4 py-2 placeholder:text-reddit-placeholder-gray"
        placeholder="What are your thoughts?"
        value={editedComment}
        onChange={handleEditedCommentChange}
      />
      <div className="-mt-1.5 flex flex-row justify-end gap-x-3 bg-reddit-gray px-2 py-1">
        <button
          className="rounded-full px-2 py-1 text-sm text-white hover:bg-reddit-hover-gray"
          onClick={() => {
            toggleEditing()
            setEditedComment(content)
          }}
        >
          Cancel
        </button>
        <button
          className="rounded-full bg-white px-2 py-1 text-sm enabled:text-black disabled:text-gray-400 disabled:hover:cursor-not-allowed"
          disabled={editedComment === ''}
          type="submit"
        >
          Save edits
        </button>
      </div>
    </form>
  )

  return (
    <div className={`${parentComment !== null && 'pl-1'} flex flex-col`}>
      <main className="mt-2 flex flex-row gap-x-4">
        <section className="flex flex-1 flex-col gap-y-1">
          <div className="flex flex-row items-center gap-x-2 text-xs">
            <Image src={Profile} alt="profile pic" className="h-8 w-8 rounded-full" />
            <div className="flex flex-row flex-wrap items-center gap-x-2 text-xs">
              <Link href={`/u/${author}`} className="font-bold tracking-tight hover:underline">
                {' '}
                {author}{' '}
              </Link>
              {postAuthor === author && <span className="font-bold text-blue-600"> OP </span>}
              <span className="text-reddit-placeholder-gray"> · </span>
              <span className="text-reddit-placeholder-gray"> {dateString} </span>
              {editedFlag && (
                <>
                  <span className="text-reddit-placeholder-gray"> · </span>
                  <span className="italic text-reddit-placeholder-gray"> {`edited ${editedDateString}`} </span>
                </>
              )}
            </div>
          </div>
          <section className="ml-4 flex flex-col gap-y-1 border-l-2 border-reddit-comment-line pl-4">
            <div>
              {isEditing
                ? editingForm
                : paragraphs?.map((row, index) => (
                    <div key={index}>
                      <span> {row} </span>
                      <br />
                    </div>
                  ))}
            </div>
            {!isEditing && (
              <CommentActions
                toggleEditing={toggleEditing}
                sameUser={author === userName}
                effectiveKarma={effectiveKarma}
                handleVoteChange={handleVoteChange}
                toggleReplyVisibility={toggleReplyVisibility}
                voteStatus={voteStatus}
              />
            )}
          </section>
          <>
            {replyFlag && (
              <div className="m-2 w-full">
                <ReplyForm
                  reply={reply}
                  setReply={setReply}
                  handleSubmit={handleSubmit}
                  toggleReplyVisibility={toggleReplyVisibility}
                />
              </div>
            )}
          </>
        </section>
      </main>

      {showReply &&
        replies?.map((reply, index) => (
          <div key={index}>
            <section className="ml-4 border-l-2 border-reddit-comment-line pl-0">
              <CommentCard _id={reply.toString()} postAuthor={postAuthor} showReply={true} />
            </section>
          </div>
        ))}
    </div>
  )
}

export default CommentCard
