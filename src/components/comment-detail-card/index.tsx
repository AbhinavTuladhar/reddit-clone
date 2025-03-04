import React, { FC } from 'react'
import Image from 'next/image'
import classnames from 'classnames'
import { Types } from 'mongoose'
import { FaRegCommentAlt } from 'react-icons/fa'
import { SlPencil } from 'react-icons/sl'
import { toast } from 'react-toastify'

import useCurrentUser from '@/hooks/useCurrentUser'
import useToggle from '@/hooks/useToggle'
import Profile from '@/images/reddit_default_pp.png'
import { CommentTypeNew } from '@/types'
import calculateDateString from '@/utils/calculateDateString'

import CommentCardNew from '../comment-card-new'
import IconWithText from '../IconWithText'
import PostVoteArrows from '../post-vote-arrows'

import EditForm from './EditForm'
import MetaData from './MetaData'
import ReplyForm from './ReplyForm'

interface CommentDetailProps {
  commentData: CommentTypeNew
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
    replies,
    content,
    createdAt,
    editedAt,
    editedFlag,
    parentComment,
    effectiveKarma,
    voteStatus,
  } = commentData

  const { userName, status } = useCurrentUser()
  const { value: replyFormFlag, toggleValue: toggleReplyForm } = useToggle(false)
  const { value: editFlag, toggleValue: toggleEditFlag } = useToggle(false)

  const handleToggleReplyForm = () => {
    if (status === 'authenticated') {
      toggleReplyForm()
    } else {
      toast.info('Please login to reply to comment.')
    }
  }

  const dateString = calculateDateString(new Date(createdAt), new Date())
  const editedDateString = calculateDateString(new Date(editedAt), new Date())

  const paragraphs = content?.split('\n')

  return (
    <div
      className={classnames({
        'ml-4': parentComment,
      })}
    >
      <article className="flex flex-col bg-reddit-dark">
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
              {editFlag ? (
                <EditForm commentId={commentId} currentComment={content} toggleEditing={toggleEditFlag} />
              ) : (
                paragraphs?.map((row, index) => (
                  <div key={index}>
                    <span> {row} </span>
                    <br />
                  </div>
                ))
              )}
              {!editFlag ? (
                <div className="relative z-20 flex w-fit items-center gap-x-2">
                  <PostVoteArrows
                    author={author}
                    resourceType="comment"
                    refetch={refetch}
                    initialVoteStatus={voteStatus}
                    effectiveKarma={effectiveKarma}
                    postId={commentId}
                  />
                  <IconWithText
                    icon={<FaRegCommentAlt className="h-4 w-4" />}
                    text="Reply"
                    handleClick={handleToggleReplyForm}
                  />
                  {userName === author ? (
                    <IconWithText icon={<SlPencil className="h-4 w-4" />} text="Edit" handleClick={toggleEditFlag} />
                  ) : null}
                </div>
              ) : null}
              {replyFormFlag && (
                <div className="relative z-10">
                  <ReplyForm toggleVisibility={toggleReplyForm} postId={postId} parentCommentId={commentId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {showReply &&
        replies?.map((reply) => (
          <div className="ml-4 border-l-2 border-reddit-comment-line pl-0" key={reply?._id?.toString()}>
            <CommentCardNew commentId={reply} showReply />
          </div>
        ))}
    </div>
  )
}

export default CommentDetailCard
