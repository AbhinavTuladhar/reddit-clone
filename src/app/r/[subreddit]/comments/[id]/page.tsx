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

  const authStatus = session?.status
  const userName = session?.data?.user?.name || ''

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

  // Check if the user is in the upvote or downvotedby list in the comment
  let initialVoteStatus: voteStatus

  if (upvotedBy.includes(userName)) {
    initialVoteStatus = 'upvoted'
  } else if (downvotedBy.includes(userName)) {
    initialVoteStatus = 'downvoted'
  } else {
    initialVoteStatus = 'nonvoted'
  }

  const [voteStatus, setVoteStatus] = useState<voteStatus>(initialVoteStatus)

  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1
  const dateString = calculateDateString(new Date(createdAt), new Date())
  const paragraphs = body?.split('\n')

  const handleVoteChange = async (targetStatus: voteStatus) => {
    if (authStatus !== 'authenticated') {
      alert('Please login to vote.')
      return
    }

    let newVoteStatus: voteStatus = 'nonvoted'

    if (voteStatus === targetStatus && targetStatus === 'upvoted') {
      newVoteStatus = 'nonvoted'
      setVoteStatus('nonvoted')
    } else if (voteStatus === targetStatus && targetStatus === 'downvoted') {
      newVoteStatus = 'nonvoted'
      setVoteStatus('nonvoted')
    } else if (targetStatus === 'upvoted' && voteStatus === 'nonvoted') {
      newVoteStatus = 'upvoted'
      setVoteStatus('upvoted')
    } else if (targetStatus === 'downvoted' && voteStatus === 'nonvoted') {
      newVoteStatus = 'downvoted'
      setVoteStatus('downvoted')
    } else if (targetStatus === 'downvoted' && voteStatus === 'upvoted') {
      newVoteStatus = 'downvoted'
      setVoteStatus('downvoted')
    } else if (targetStatus === 'upvoted' && voteStatus === 'downvoted') {
      newVoteStatus = 'upvoted'
      setVoteStatus('upvoted')
    }

    const requestBody = { user: userName, voteTarget: newVoteStatus }

    await axios.patch(`/api/post/${_id}`, requestBody)
    mutate()
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
    <form className='flex flex-col flex-1 gap-y-2' onSubmit={handleSubmit}>
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
          className='px-2 py-1 text-sm bg-white rounded-full disabled:text-gray-400 enabled:text-black'
          disabled={comment === ''}
        >
          Comment
        </button>
      </div>
    </form>
  )

  const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

  return (
    <main className='flex flex-col w-full px-8 py-4 mx-auto mt-4 border gap-y-6 bg-reddit-dark lg:w-3/4 border-reddit-border'>
      <div className='flex flex-row gap-x-4'>
        <section className='flex flex-col items-center gap-y-1'>
          <PiArrowFatUpFill
            className={classnames(
              baseIconClassName,
              { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
              { 'text-reddit-orange': voteStatus === 'upvoted' },
              'hover:text-reddit-orange'
            )}
            onClick={() => handleVoteChange('upvoted')}
          />
          <span> {effectiveKarma}</span>
          <PiArrowFatDownFill
            className={classnames(
              baseIconClassName,
              { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
              { 'text-indigo-400': voteStatus === 'downvoted' },
              'hover:text-indigo-400'
            )}
            onClick={() => handleVoteChange('downvoted')}
          />
        </section>
        <section className='flex flex-col flex-1 gap-y-2'>

          <div className='flex flex-row items-center text-xs text-gray-400 gap-x-1'>
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
              <div className='flex flex-row items-center p-2 gap-x-2 hover:cursor-pointer hover:bg-reddit-hover-gray' key={index}>
                <span> {row.icon} </span>
                <span className='text-reddit-placeholder-gray'> {row.label} </span>
              </div>
            ))}
          </section>

          <>
            {authStatus === 'authenticated' && commentForm}
          </>

          <div className="relative flex items-center py-5">
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
