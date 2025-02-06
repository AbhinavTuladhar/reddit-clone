import React, { FC } from 'react'
import Link from 'next/link'
import { Types } from 'mongoose'
import { FaRegCommentAlt } from 'react-icons/fa'

import usePost from '@/hooks/usePost'

interface CommentHeaderProps {
  postId: Types.ObjectId
  userName: string
}

/**
 * For displaying information about the post that the comment belongs to
 */
const CommentHeader: FC<CommentHeaderProps> = ({ postId, userName }) => {
  const { data, isLoading, isError } = usePost(postId.toString())

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!data) {
    return <div>Comment not found</div>
  }

  const { author, subreddit, title } = data

  return (
    <Link
      href={`/r/${subreddit}/comments/${postId}`}
      className="mb-0 flex flex-row flex-wrap items-center gap-x-1 border border-reddit-border bg-reddit-dark p-2 text-xs duration-300 hover:cursor-pointer hover:border-white"
    >
      <FaRegCommentAlt className="mr-2 h-4 w-4 text-reddit-placeholder-gray" />
      <span> {userName} </span>
      <span className="text-reddit-placeholder-gray"> commented on </span>
      <span className="text-white"> {`${title}`} </span>
      <span> • </span>
      <Link className="font-bold text-white hover:underline" href={`/r/${subreddit}`}>{`/r/${subreddit}`}</Link>
      <span className="text-reddit-placeholder-gray">
        Posted by
        <Link className="hover:underline" href={`/u/${author}`}>
          {`u/${author}`}
        </Link>
      </span>
    </Link>
  )
}

export default CommentHeader
