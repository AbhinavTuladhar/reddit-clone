'use client'

import React, { FC } from 'react'
import { useSession } from 'next-auth/react'
import { Types } from 'mongoose'

import PostService from '@/services/post.service'
import getVoteStatus from '@/utils/getVoteStatus'
import { useQuery } from '@tanstack/react-query'

import PresentationalCard from './PresentationalCard'

interface PostCardProps {
  postId: Types.ObjectId
  subViewFlag?: boolean
}

const PostCard: FC<PostCardProps> = ({ postId, subViewFlag }) => {
  const { data } = useSession()
  const userName = data?.user?.name || ''

  const {
    data: postData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => PostService.getPost(postId.toString()),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !postData) {
    return <div>Error</div>
  }

  const { author, upvotedBy, downvotedBy } = postData

  const voteStatus = getVoteStatus({ author, upvotedBy, downvotedBy, userName })

  return (
    <PresentationalCard
      postId={postId}
      postData={postData}
      refetch={refetch}
      subViewFlag={subViewFlag}
      initialVoteStatus={voteStatus}
    />
  )
}

export default PostCard
