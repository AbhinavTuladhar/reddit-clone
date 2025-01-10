'use client'

import React from 'react'
import { Types } from 'mongoose'

import PostService from '@/services/post.service'
import { useQueries } from '@tanstack/react-query'

import PostCard from '../PostCard'

interface PostsListProps {
  postIds: Array<Types.ObjectId>
}

const PostsList: React.FC<PostsListProps> = ({ postIds }) => {
  const { data: postData, isLoading } = useQueries({
    queries: postIds.map((id) => ({
      queryKey: ['post-detail', id],
      queryFn: () => PostService.getPost(id.toString()),
    })),
    combine: (results) => ({
      data: results.map((result) => result.data),
      isLoading: results.some((result) => result.isLoading),
    }),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!postData) {
    return <div>No data</div>
  }

  return (
    <div className="flex flex-col">
      {postData.map((post) => (
        <PostCard key={post?._id.toString()} id={post?._id} subViewFlag={false} />
      ))}
    </div>
  )
}

export default PostsList
