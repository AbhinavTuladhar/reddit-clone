'use client'

import React, { useState, useEffect } from 'react';
import { PiArrowFatUpBold, PiArrowFatDownBold } from 'react-icons/pi'
import useFetch from '@/utils/useFetch';
import { SubredditType, PostType } from '@/types/types'
import PostCard from '@/components/PostCard';
import axios from 'axios'
import Link from 'next/link';
// import { PostType } from '@/types/types'

interface SubredditCommentParams {
  params: {
    subreddit: string,
    id: string
  }
}

const Page: React.FC<SubredditCommentParams> = ({
  params,
}) => {
  const subredditName = params.subreddit;
  const postId = params.id

  const { data } = useFetch<PostType | null>(`/api/post/${postId}`)

  const { author,
    subreddit,
    title,
    body,
    createdAt,
    upvotedBy = [],
    downvotedBy = [],
    comments
  } = data || {}

  const effectiveKarma = upvotedBy?.length + downvotedBy.length === 0 ? 1 : (upvotedBy.length < downvotedBy.length ? 0 : upvotedBy.length - downvotedBy.length)

  return (
    <main className='flex flex-row gap-x-6 bg-reddit-dark w-full lg:w-3/4 mx-auto border border-reddit-border px-8 py-4'>
      <section className='flex flex-col items-center gap-y-1'>
        <PiArrowFatUpBold className='hover:bg-red-600' />
        <span> {effectiveKarma}</span>
        <PiArrowFatDownBold className='hover:bg-blue-600' />
      </section>
      <section className='flex flex-col gap-y-4'>
        <small className='text-gray-400 text-xs'>
          {`Posted by u/${author}`}
        </small>
        <h1 className='text-xl font-bold'>
          {title}
        </h1>
        <p>
          {body}
        </p>
      </section>
    </main>
  );
};

export default Page;
