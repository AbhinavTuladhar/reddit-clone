'use client'

import React from 'react'
import { PiArrowFatUpBold, PiArrowFatDownBold } from 'react-icons/pi'
import { PostType as PostProps } from '@/types/types'

const PostCard: React.FC<PostProps> = ({
  author,
  subreddit,
  title,
  body = '',
  createdAt,
  upvotedBy,
  downvotedBy,
  comments,
}) => {
  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : (upvotedBy.length < downvotedBy.length ? 0 : upvotedBy.length - downvotedBy.length)

  return (
    <main className='flex flex-row items-center gap-x-4 bg-reddit-dark border border-reddit-border px-4 py-2 hover:cursor-poiner hover:border-white'>
      <div className='flex flex-col items-center'>
        <PiArrowFatUpBold className='hover:bg-red-600' />
        <span> {effectiveKarma} </span>
        <PiArrowFatDownBold className='hover:bg-blue-600' />
      </div>
      <section className='flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-1'>
          <h1 className='text-lg'>
            {title}
          </h1>
          <div className='flex flex-row gap-x-1 text-sm'>
            <span className='font-bold'> {`r/${subreddit}`} </span>
            <span className='text-gray-400'> {`Posted by u/${author}`} </span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PostCard