'use client'

import React, { FC } from 'react'
import { Types } from 'mongoose'

import useCurrentUser from '@/hooks/useCurrentUser'
import PostService from '@/services/post.service'
import getVoteStatus from '@/utils/getVoteStatus'
import { useQuery } from '@tanstack/react-query'

import PresentationalCard from './PresentationalCard'

interface PostCardProps {
  postId: Types.ObjectId
  subViewFlag?: boolean
}

const PostCard: FC<PostCardProps> = ({ postId, subViewFlag }) => {
  const { userName } = useCurrentUser()

  const {
    data: postData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => PostService.getPost(postId.toString()),
  })

  if (isLoading) {
    return <div className="grid h-[100px] place-items-center bg-reddit-dark"> Loading...</div>
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
