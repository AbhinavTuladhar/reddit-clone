import React from 'react'
import Link from 'next/link'
import { FaRegCommentAlt } from 'react-icons/fa'

interface CommentHeaderProps {
  postAuthor: string | undefined
  postSubreddit: string | undefined
  postTitle: string | undefined
  postId: string | undefined
  userName: string | undefined
}

const CommentHeader: React.FC<CommentHeaderProps> = ({ postAuthor, postSubreddit, postTitle, postId, userName }) => {
  return (
    <Link
      href={`/r/${postSubreddit}/comments/${postId}`}
      className="mb-0 flex flex-row flex-wrap items-center gap-x-1 border border-reddit-border bg-reddit-dark p-2 text-xs duration-300 hover:cursor-pointer hover:border-white"
    >
      <FaRegCommentAlt className="mr-2 h-4 w-4 text-reddit-placeholder-gray" />
      <span> {userName} </span>
      <span className="text-reddit-placeholder-gray"> commented on </span>
      <span className="text-white"> {`${postTitle}`} </span>
      <span> • </span>
      <Link className="font-bold text-white hover:underline" href={`/r/${postSubreddit}`}>{`/r/${postSubreddit}`}</Link>
      <span className="text-reddit-placeholder-gray">
        Posted by
        <Link className="hover:underline" href={`/u/${postAuthor}`}>
          {' '}
          {`u/${postAuthor}`}{' '}
        </Link>
      </span>
    </Link>
  )
}

export default CommentHeader
