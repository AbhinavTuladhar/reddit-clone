import React from 'react'
import { Types } from 'mongoose'

import PostService from '@/services/post.service'
import { voteStatus } from '@/types'
import { useQuery } from '@tanstack/react-query'

import VotingArrows from './VotingArrows'

interface PostVoteArrowProps {
  postId: Types.ObjectId
  initialVoteStatus: voteStatus
}

const PostVoteArrows: React.FC<PostVoteArrowProps> = ({ postId, initialVoteStatus }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => PostService.getPost(String(postId)),
  })

  if (isLoading) {
    return <div> Loading... </div>
  }

  if (isError) {
    return <div> Error </div>
  }

  if (!data) {
    return <div> No data </div>
  }

  const { author, upvotedBy, downvotedBy } = data
  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1

  return (
    <VotingArrows
      effectiveKarma={effectiveKarma}
      postId={postId}
      author={author}
      refetch={refetch}
      initialVoteStatus={initialVoteStatus}
    />
  )
}

export default PostVoteArrows
