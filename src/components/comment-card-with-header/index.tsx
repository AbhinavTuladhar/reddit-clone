import React, { FC } from 'react'
import Link from 'next/link'
import { Types } from 'mongoose'
import { FaRegCommentAlt } from 'react-icons/fa'

import PostService from '@/services/post.service'
import { useQuery } from '@tanstack/react-query'

import CommentCardNew from '../comment-card-new'

interface CommentHeaderProps {
  commentId: Types.ObjectId
  postId: Types.ObjectId
  userName: string
}

const CommentCardWithHeader: FC<CommentHeaderProps> = ({ commentId, postId, userName }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => PostService.getPost(postId.toString()),
  })

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
    <article className=" relative border border-transparent duration-300 hover:border-white">
      <Link href={`/r/${subreddit}/comments/${postId}`} className="absolute inset-0" />
      <div className="mb-0 flex flex-row flex-wrap items-center gap-x-1 border border-reddit-border bg-reddit-dark p-2 text-xs duration-300 hover:cursor-pointer hover:border-white">
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
      </div>
      <section className={`${'pb-2 pl-2'} bg-reddit-dark`}>
        <CommentCardNew commentId={commentId} showReply={false} />
      </section>
    </article>
  )
}

export default CommentCardWithHeader
