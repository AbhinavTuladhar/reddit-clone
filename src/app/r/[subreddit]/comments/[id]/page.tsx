'use client'

import React, { useState, useEffect } from 'react';
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import useFetch from '@/utils/useFetch';
import { SubredditType, PostType, CommentType as CommentProps, voteStatus } from '@/types/types'
import PostCard from '@/components/PostCard';
import axios from 'axios'
import Link from 'next/link';
import { FaRegCommentAlt } from 'react-icons/fa'
import { FiGift } from 'react-icons/fi'
import { PiShareFatBold } from 'react-icons/pi'
import { useSession } from 'next-auth/react';
import CommentCard from '@/components/CommentCard';
import useSWR from 'swr'
import classnames from 'classnames';
import calculateDateString from '@/utils/calculateDateString';
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
  const [commentData, setCommentData] = useState<string[]>([])
  const [voteStatus, setVoteStatus] = useState<voteStatus>('nonvoted')

  const authStatus = session?.status
  const userName = session?.data?.user?.name

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, mutate } = useSWR<PostType | null>(`/api/post/${postId}`, fetcher)

  const {
    _id,
    author,
    subreddit,
    title,
    body,
    createdAt = '',
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
  const dateString = calculateDateString(new Date(createdAt), new Date())
  const paragraphs = body?.split('\n')

  const handleVoteChange = (targetStatus: voteStatus) => {
    if (voteStatus === targetStatus) {
      setVoteStatus('nonvoted')
    } else {
      setVoteStatus(targetStatus)
    }
  }

  // For fethcing the comments
  useEffect(() => {
    if (comments?.length === 0 || !comments) {
      return
    }

    // const fetchData = async () => {
    //   const responses: CommentProps[] = await Promise.all(
    //     comments.map(async (comment: string) => await axios.get(`/api/comment/${comment}`).then(response => response.data))
    //   )
    //   setCommentData(responses)
    // }
    // fetchData()
    setCommentData(comments)
  }, [comments])

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
    mutate()
  }

  useEffect(() => {
    console.log(voteStatus)
  }, [voteStatus])

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

  const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

  return (
    <main className='flex flex-col gap-y-6 bg-reddit-dark w-full lg:w-3/4 mx-auto border border-reddit-border px-8 py-4 mt-4'>
      <div className='flex flex-row gap-x-4'>
        <section className='flex flex-col items-center gap-y-1'>
          <PiArrowFatUpFill
            className={classnames(
              baseIconClassName,
              { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
              { 'text-reddit-orange': voteStatus === 'downvoted' },
              'hover:text-orange-500'
            )}
            onClick={() => handleVoteChange('downvoted')}
          />
          <span> {effectiveKarma}</span>
          <PiArrowFatDownFill
            className={classnames(
              baseIconClassName,
              { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
              { 'text-indigo-400': voteStatus === 'upvoted' },
              'hover:text-indigo-500'
            )}
            onClick={() => handleVoteChange('upvoted')}
          />
        </section>
        <section className='flex flex-col flex-1 gap-y-2'>

          <div className='text-gray-400 text-xs flex flex-row items-center gap-x-1'>
            <span> {`Posted by u/${author}`} </span>
            <span> {dateString} </span>
          </div>
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

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-white"> {comments?.length} comments </span>
          </div>

          <>
            {commentData?.map(comment => (
              <CommentCard id={comment} />
            ))}
          </>

        </section>
      </div>
    </main>
  );
};

export default Page;
