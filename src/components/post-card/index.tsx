'use client'

import React, { FC } from 'react'
import { useSession } from 'next-auth/react'
import { Types } from 'mongoose'

import PostService from '@/services/post.service'
import { voteStatus } from '@/types'
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

  console.log({ postId })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !postData) {
    return <div>Error</div>
  }

  const { author, subreddit, title, createdAt, upvotedBy, downvotedBy, comments } = postData

  let initialVoteStatus: voteStatus = 'nonvoted'

  if (upvotedBy.includes(userName) || author === userName) {
    initialVoteStatus = 'upvoted'
  } else if (downvotedBy.includes(userName)) {
    initialVoteStatus = 'downvoted'
  } else {
    initialVoteStatus = 'nonvoted'
  }

  return (
    <PresentationalCard
      postId={postId}
      author={author}
      subreddit={subreddit}
      title={title}
      createdAt={createdAt.toString()}
      upvotedBy={upvotedBy}
      downvotedBy={downvotedBy}
      comments={comments.map((comment) => comment.toString())}
      refetch={refetch}
      subViewFlag={subViewFlag}
      initialVoteStatus={initialVoteStatus}
    />
  )
}

export default PostCard
