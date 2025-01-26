'use client'

import React, { FC, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { PAGINATION_SIZE } from '@/constants'
import FeedService from '@/services/feed.service'
import { SimpleVoteStatus } from '@/types'
import { hasData } from '@/utils/data.utils'
import { useInfiniteQuery } from '@tanstack/react-query'

import Loader from '../Loader'
import PostCard from '../post-card'

interface VotedPostsListProps {
  userName: string
  voteType: SimpleVoteStatus
}

const VotedPostsList: FC<VotedPostsListProps> = ({ userName, voteType }) => {
  const { ref, inView } = useInView({
    rootMargin: '200px',
  })

  const { data, error, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['voted-posts', userName, voteType],
    queryFn: ({ pageParam }) => FeedService.getUserVotedPosts({ userName, pageParam, voteType }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than the limit, there are no more pages
      const hasMore = lastPage?.length === PAGINATION_SIZE
      return hasMore ? allPages.length * PAGINATION_SIZE : undefined
    },
  })

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center bg-reddit-dark">
        <Loader />
      </div>
    )
  }

  if (error) {
    return <div> {error.message} </div>
  }

  if (!data) {
    return <div> No data </div>
  }

  const noData = hasData(data)

  if (noData) {
    return <p className="mx-auto my-2 w-full text-center text-lg">You have not {voteType} any post yet!</p>
  }

  return (
    <div className="flex flex-col gap-px">
      {data.pages.map((page) =>
        page?.map((postId) => <PostCard key={postId.toString()} postId={postId} subViewFlag={true} />),
      )}
      <div ref={ref}>{isFetchingNextPage && <Loader />}</div>
      <div>{!hasNextPage && <p className="mx-auto my-2 w-full text-center text-lg">You have seen all posts!</p>}</div>
    </div>
  )
}

export default VotedPostsList
