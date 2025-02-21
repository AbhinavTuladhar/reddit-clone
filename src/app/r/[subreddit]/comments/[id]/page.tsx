'use client'

import React from 'react'

import AboutSubreddit from '@/components/about-subreddit'
import CommentCardNew from '@/components/comment-card-new'
import PostVoteArrows from '@/components/post-vote-arrows'
import useCurrentUser from '@/hooks/useCurrentUser'
import usePost from '@/hooks/usePost'

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

  const { data: postData, isLoading, isError, refetch } = usePost(postId, userName)

  if (isLoading) {
    return <div> Loading... </div>
  }

  if (isError) {
    return <div> Error </div>
  }

  if (!postData) {
    return <div> Post not found </div>
  }

  const { _id, author, subreddit, title, body, createdAt, comments, topLevelComments, voteStatus, effectiveKarma } =
    postData
  const paragraphs = body?.split('\n')

  const commentData = topLevelComments.map((comment) => comment.toString())

  return (
    <main className="mt-4 flex flex-col gap-4 lg:flex-row">
      <section className="mx-auto flex w-full flex-1 flex-col gap-y-6 border border-reddit-border bg-reddit-dark px-2 py-4 md:px-4">
        <div className="flex flex-row gap-x-4">
          <PostVoteArrows
            postId={_id}
            initialVoteStatus={voteStatus}
            author={author}
            refetch={refetch}
            resourceType="post"
            effectiveKarma={effectiveKarma}
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

        {commentData.map((comment) => (
          <CommentCardNew key={comment.toString()} commentId={comment} postAuthor={author || ''} showReply />
        ))}
      </section>

      <section className="w-full lg:w-80">
        <div className="sticky top-16">
          <AboutSubreddit subName={subredditName} />
        </div>
      </section>
    </main>
  )
}

export default Page
