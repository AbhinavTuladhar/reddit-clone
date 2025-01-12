import React, { FC } from 'react'
import Image from 'next/image'
import classnames from 'classnames'
import { Types } from 'mongoose'
import { FaRegCommentAlt } from 'react-icons/fa'

import useCurrentUser from '@/hooks/useCurrentUser'
import useToggle from '@/hooks/useToggle'
import Profile from '@/images/reddit_default_pp.png'
import { CommentType } from '@/types'
import calculateDateString from '@/utils/calculateDateString'
import getVoteStatus from '@/utils/getVoteStatus'

import CommentCardNew from '../comment-card-new'
import IconWithText from '../IconWithText'
import PostVoteArrows from '../post-vote-arrows'

import MetaData from './MetaData'
import ReplyForm from './ReplyForm'

interface CommentDetailProps {
  commentData: CommentType
  commentId: Types.ObjectId
  postAuthor: string
  showReply?: boolean
  refetch: () => void
}

const CommentDetailCard: FC<CommentDetailProps> = ({
  commentId,
  postAuthor,
  commentData,
  refetch,
  showReply = false,
}) => {
  const {
    author,
    post: postId,
    upvotedBy,
    downvotedBy,
    replies,
    content,
    createdAt,
    editedAt,
    editedFlag,
    parentComment,
  } = commentData

  const { userName } = useCurrentUser()
  const { value: replyFormFlag, toggleValue: toggleReplyForm } = useToggle(false)

  const dateString = calculateDateString(new Date(createdAt), new Date())
  const editedDateString = calculateDateString(new Date(editedAt), new Date())

  const paragraphs = content?.split('\n')

  const initialVoteStatus = getVoteStatus({
    author,
    upvotedBy,
    downvotedBy,
    userName,
  })

  return (
    <div className="flex flex-col">
      <article
        className={classnames('flex flex-col', {
          'pl-2': parentComment,
        })}
      >
        <div className="mt-2 flex gap-x-4">
          <div className="flex flex-1 flex-col gap-y-1">
            <div className="flex items-center gap-x-2 text-xs">
              <Image src={Profile} alt="profile picture" width={32} height={32} className="h-8 w-8 rounded-full" />
              <MetaData
                author={author}
                dateString={dateString}
                editedDateString={editedDateString}
                editedFlag={editedFlag}
                postAuthor={postAuthor}
              />
            </div>
            <div className="ml-4 flex flex-col gap-y-1 border-l-2 border-reddit-comment-line pl-4">
              {paragraphs?.map((row, index) => (
                <div key={index}>
                  <span> {row} </span>
                  <br />
                </div>
              ))}
              <div className="flex items-center gap-x-2">
                <PostVoteArrows
                  author={author}
                  downvotedBy={downvotedBy}
                  upvotedBy={upvotedBy}
                  resourceType="comment"
                  refetch={refetch}
                  initialVoteStatus={initialVoteStatus}
                  postId={commentId}
                />
                <IconWithText
                  icon={<FaRegCommentAlt className="h-4 w-4" />}
                  text="Reply"
                  handleClick={toggleReplyForm}
                />
              </div>
              {replyFormFlag && (
                <ReplyForm
                  toggleVisibility={toggleReplyForm}
                  postId={postId}
                  refetch={refetch}
                  parentCommentId={commentId}
                />
              )}
            </div>
          </div>
        </div>
      </article>

      {showReply && (
        <div className="flex flex-col">
          {replies?.map((reply) => (
            <div className="ml-4 border-l-2 border-reddit-comment-line pl-0" key={reply?._id?.toString()}>
              <CommentCardNew commentId={reply} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentDetailCard
