'use client'

import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import CreatePostCard from '@/components/CreatePostCard'
import HomeSidebar from '@/components/HomeSidebar'
import PopularCommunities from '@/components/PopularCommunities'
import PostCard from '@/components/post-card'
import useCurrentUser from '@/hooks/useCurrentUser'
import FeedService from '@/services/feed.service'
import { useInfiniteQuery } from '@tanstack/react-query'

export default function Home() {
  const { status: userStatus } = useCurrentUser()
  const { ref, inView } = useInView()

  const { data, error, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['home'],
    queryFn: FeedService.getHomePosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than the limit, there are no more pages
      const hasMore = lastPage?.length === 10
      return hasMore ? allPages.length * 10 : undefined
    },
  })

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  if (isLoading) {
    return <div> Loading... </div>
  }

  if (error) {
    return <div> {error.message} </div>
  }

  if (!data) {
    return <div> No data </div>
  }

  return (
    <div className="mt-4 flex flex-col-reverse gap-4 lg:flex-row">
      <div className="flex flex-1 flex-col">
        {userStatus === 'authenticated' && (
          <section className="mb-4">
            <CreatePostCard />
          </section>
        )}

        <div className="flex flex-col gap-px">
          {data.pages.map((page) =>
            page?.map((postId) => <PostCard key={postId.toString()} postId={postId} subViewFlag={true} />),
          )}
          <div ref={ref}>
            {isFetchingNextPage && <p className="mx-auto my-2 w-full text-center text-lg">Loading...</p>}
          </div>
          <div>
            {!hasNextPage && <p className="mx-auto my-2 w-full text-center text-lg">You have seen all posts!</p>}
          </div>
        </div>

        {/* <InfiniteScroll
          dataLength={postIds.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<LoadingRow />}
          endMessage={<p className="mx-auto my-2 w-full text-center text-lg">You have seen all posts!</p>}
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <main className="gapy-y-0 flex flex-col">
            {postIds?.map((postId: string, index) => <PostCard id={postId} subViewFlag={true} key={index} />)}
          </main>
        </InfiniteScroll> */}
      </div>
      <section className="flex w-full flex-col gap-y-4 lg:w-80">
        {userStatus === 'authenticated' && (
          <div className="hidden lg:block">
            <HomeSidebar />
          </div>
        )}
        <div className="sticky top-16">
          <PopularCommunities />
        </div>
      </section>
    </div>
  )
}
