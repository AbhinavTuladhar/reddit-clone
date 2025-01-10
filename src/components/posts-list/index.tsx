'use client'

import React from 'react'
import { Types } from 'mongoose'

import PostCard from '../post-card'

interface PostsListProps {
  postIds: Array<Types.ObjectId>
}

const PostsList: React.FC<PostsListProps> = ({ postIds }) => {
  return (
    <div className="flex flex-col">
      {postIds.map((id) => (
        <PostCard key={id.toString()} postId={id} subViewFlag={false} />
      ))}
    </div>
  )
}

export default PostsList
