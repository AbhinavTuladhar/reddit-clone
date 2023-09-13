'use client'

import React, { useState, useEffect } from 'react';
import { PiArrowFatUpBold, PiArrowFatDownBold } from 'react-icons/pi'
import useFetch from '@/utils/useFetch';
import { SubredditType, PostType } from '@/types/types'
import PostCard from '@/components/PostCard';
import axios from 'axios'
import Link from 'next/link';
import { FaRegCommentAlt } from 'react-icons/fa'
import { FiGift } from 'react-icons/fi'
import { PiShareFatBold } from 'react-icons/pi'
import { useSession } from 'next-auth/react';
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

  const session = useSession()
  const [comment, setComment] = useState<string>('')

  const authStatus = session?.status
  const userName = session?.data?.user?.name

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

  const iconClassName = 'text-reddit-placeholder-gray font-bold'

  const iconBarData = [
    { icon: <FaRegCommentAlt className={iconClassName} />, label: `${comments?.length || 0} comments` },
    { icon: <FiGift className={iconClassName} />, label: 'Award' },
    { icon: <PiShareFatBold className={iconClassName} />, label: 'Share' },
  ]

  const effectiveKarma = upvotedBy?.length + downvotedBy.length === 0 ? 1 : (upvotedBy.length < downvotedBy.length ? 0 : upvotedBy.length - downvotedBy.length)
  const paragraphs = body?.split('\n')

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target: { value } } = event
    setComment(value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody = {
      content: comment,
      author: userName,
      post: postId,
    }

    await axios.post('/api/comment', requestBody)
    setComment('')
  }

  const commentForm = (
    <form className='flex flex-col gap-y-2 flex-1' onSubmit={handleSubmit}>
      <span className='text-sm'>
        Comment as&nbsp;
        <Link href={`/u/${userName}`} className='text-blue-500 hover:underline hover:text-red-500'>
          {userName}
        </Link>
      </span>
      <textarea
        className='w-full px-4 py-2 h-32 border-[1px] border-reddit-border bg-reddit-dark resize-none placeholder:text-reddit-placeholder-gray'
        placeholder='What are your thoughts?'
        onChange={handleChange}
        value={comment}
      />
      <div className='bg-reddit-gray -mt-1.5 px-2 py-1 flex flex-row justify-end'>
        <button
          className='bg-white disabled:text-gray-400 enabled:text-black text-sm rounded-full py-1 px-2'
          disabled={comment === ''}
        >
          Comment
        </button>
      </div>
    </form>
  )

  return (
    <main className='flex flex-col gap-y-6 bg-reddit-dark w-full lg:w-3/4 mx-auto border border-reddit-border px-8 py-4 my-4'>
      <div className='flex flex-row gap-x-4'>
        <section className='flex flex-col items-center gap-y-1'>
          <PiArrowFatUpBold className='hover:bg-red-600' />
          <span> {effectiveKarma}</span>
          <PiArrowFatDownBold className='hover:bg-blue-600' />
        </section>
        <section className='flex flex-col flex-1 gap-y-2'>

          <small className='text-gray-400 text-xs'>
            {`Posted by u/${author}`}
          </small>
          <h1 className='text-xl font-bold'>
            {title}
          </h1>
          {paragraphs?.map((row) => (
            <>
              {row} <br />
            </>
          ))}

          <section className='flex flex-row gap-x-4'>
            {iconBarData.map((row, index) => (
              <div className='p-2 flex flex-row gap-x-2 items-center hover:cursor-pointer hover:bg-reddit-hover-gray' key={index}>
                <span> {row.icon} </span>
                <span className='text-reddit-placeholder-gray'> {row.label} </span>
              </div>
            ))}
          </section>

          <>
            {authStatus === 'authenticated' && commentForm}
          </>

        </section>
      </div>
    </main>
  );
};

export default Page;
