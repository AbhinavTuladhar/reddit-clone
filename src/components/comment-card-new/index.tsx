import React, { FC } from 'react'
import { Types } from 'mongoose'

import useComment from '@/hooks/useComment'
import useCurrentUser from '@/hooks/useCurrentUser'

import CommentDetailCard from '../comment-detail-card'

interface CommentCardProps {
  commentId: Types.ObjectId | string
  postAuthor?: string
  showReply?: boolean
}

const CommentCardNew: FC<CommentCardProps> = ({ commentId, postAuthor, showReply }) => {
  const { userName } = useCurrentUser()
  const { data: commentData, isLoading, isError, refetch } = useComment(commentId.toString(), userName)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!commentData) {
    return <div>Comment not found</div>
  }

  return (
    <CommentDetailCard
      commentId={commentId as Types.ObjectId}
      refetch={refetch}
      postAuthor={postAuthor || ''}
      commentData={commentData}
      showReply={showReply}
    />
  )
}

export default CommentCardNew
