import React from 'react'
import Link from 'next/link'
import { FaRegCommentAlt } from 'react-icons/fa'

interface CommentHeaderProps {
  postAuthor: string | undefined,
  postSubreddit: string | undefined,
  postTitle: string | undefined,
  postId: string | undefined,
  userName: string | undefined
}

const CommentHeader: React.FC<CommentHeaderProps> = ({ postAuthor, postSubreddit, postTitle, postId, userName }) => {
  return (
    <Link href={`/r/${postSubreddit}/comments/${postId}`} className='flex flex-row flex-wrap items-center p-2 mb-0 text-xs duration-300 border border-reddit-border gap-x-1 bg-reddit-dark hover:border-white hover:cursor-pointer'>
      <FaRegCommentAlt className='w-4 h-4 mr-2 text-reddit-placeholder-gray' />
      <span> {userName} </span>
      <span className='text-reddit-placeholder-gray'> commented on </span>
      <span className='text-white'> {`${postTitle}`} </span>
      <span> • </span>
      <Link className='font-bold text-white hover:underline' href={`/r/${postSubreddit}`}>{`/r/${postSubreddit}`}</Link>
      <span className='text-reddit-placeholder-gray'>
        Posted by
        <Link className='hover:underline' href={`/u/${postAuthor}`}> {`u/${postAuthor}`} </Link>
      </span>
    </Link>
  )
}

export default CommentHeader