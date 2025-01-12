'use client'

import React from 'react'

import AboutCommunity from '@/components/AboutCommunity'
import CommentCardNew from '@/components/comment-card-new'
import PostVoteArrows from '@/components/post-vote-arrows'
import useCurrentUser from '@/hooks/useCurrentUser'
import PostService from '@/services/post.service'
import { voteStatus } from '@/types'
import { useQuery } from '@tanstack/react-query'

import { CommentForm, IconRow, MetaData } from './_components'

interface SubredditCommentParams {
  params: {
    subreddit: string
    id: string
  }
}

const Page: React.FC<SubredditCommentParams> = ({ params }) => {
  const subredditName = params.subreddit
  const postId = params.id

  const { status, userName } = useCurrentUser()

  const {
    data: postData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => PostService.getPost(postId),
  })

  if (isLoading) {
    return <div> Loading... </div>
  }

  if (isError) {
    return <div> Error </div>
  }

  if (!postData) {
    return <div> Post not found </div>
  }

  const { _id, author, subreddit, title, body, createdAt, upvotedBy, downvotedBy, comments, topLevelComments } =
    postData
  // Check if the user is in the upvote or downvotedby list in the comment
  let initialVoteStatus: voteStatus = 'nonvoted'

  if (upvotedBy.includes(userName) || author === userName) {
    initialVoteStatus = 'upvoted'
  } else if (downvotedBy.includes(userName)) {
    initialVoteStatus = 'downvoted'
  } else {
    initialVoteStatus = 'nonvoted'
  }

  // setVoteStatus(initialVoteStatus)

  const paragraphs = body?.split('\n')

  const commentData = topLevelComments.map((comment) => comment.toString())

  return (
    <main className="mt-4 flex flex-col gap-4 lg:flex-row">
      <section className="mx-auto flex w-full flex-1 flex-col gap-y-6 border border-reddit-border bg-reddit-dark px-2 py-4 md:px-4">
        <div className="flex flex-row gap-x-4">
          <PostVoteArrows
            postId={_id}
            initialVoteStatus={initialVoteStatus}
            author={author}
            upvotedBy={upvotedBy}
            downvotedBy={downvotedBy}
            refetch={refetch}
            resourceType="post"
          />
          <section className="flex flex-1 flex-col gap-y-2">
            <MetaData createdAt={createdAt} subreddit={subreddit} author={author} />
            <h1 className="text-xl font-bold">{title}</h1>
            {paragraphs?.map((row, index) => (
              <div key={index}>
                {row} <br />
              </div>
            ))}
            <IconRow commentCount={comments?.length || 0} />
            {status === 'authenticated' ? (
              <CommentForm userName={userName} postId={_id} refetchComments={refetch} />
            ) : null}
          </section>
        </div>

        <div className="flex items-center py-5">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="ml-4 flex flex-shrink justify-end text-white"> {comments?.length} comments </span>
        </div>

        {/* {commentData.map((comment, index) => (
          <CommentCard _id={comment.toString()} postAuthor={author || ''} showReply={true} key={index} />
        ))} */}

        {commentData.map((comment) => (
          <CommentCardNew key={comment.toString()} commentId={comment} postAuthor={author || ''} showReply />
        ))}
      </section>

      <section className="w-full lg:w-80">
        <div className="sticky top-16">
          <AboutCommunity subName={subredditName} />
        </div>
      </section>
    </main>
  )
}

export default Page
