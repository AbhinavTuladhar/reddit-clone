import React, { FC } from 'react'
import { Types } from 'mongoose'

import CommentService from '@/services/comment.service'
import { useQuery } from '@tanstack/react-query'

import CommentDetailCard from '../comment-detail-card'

interface CommentCardProps {
  commentId: Types.ObjectId | string
  postAuthor?: string
  showReply?: boolean
}

const CommentCardNew: FC<CommentCardProps> = ({ commentId, postAuthor, showReply }) => {
  const {
    data: commentData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['comment-detail', commentId],
    queryFn: () => CommentService.getComment(commentId.toString()),
  })

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
