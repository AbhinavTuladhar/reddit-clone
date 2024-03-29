'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import PostCard from '@/components/PostCard'
import { VotedPostsResponse } from '@/types/types'
import InfiniteScroll from 'react-infinite-scroll-component'
import LoadingRow from '@/components/LoadingRow'

interface UserParams {
  params: {
    user: string
  }
}

const Page: React.FC<UserParams> = ({ params }) => {
  const userName = params.user
  const session = useSession()
  const currentUser = session.data?.user?.name

  const [upvotedPosts, setUpvotedPosts] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [index, setIndex] = useState<number>(5)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<VotedPostsResponse>(`/api/u/${userName}/voted?offset=0&limit=5`)
      const votedPosts = response.data
      if (votedPosts.upvotedIds.length === 0) {
        setIsEmpty(true)
      }
      if (votedPosts.upvotedIds.length < 5) {
        setHasMore(false)
      }
      setUpvotedPosts(votedPosts.upvotedIds)
    }
    fetchData()
  })

  const fetchMoreData = async () => {
    const response = await axios.get<VotedPostsResponse>(`/api/u/${userName}/voted?offset=${index}&limit=5`)
    const upvotedPosts = response.data.upvotedIds
    setUpvotedPosts((prevData) => [...prevData, ...upvotedPosts])
    setIndex((prevIndex) => prevIndex + 5)
  }

  if (userName !== currentUser) {
    return (
      <div className="mb-4 flex h-screen flex-1 flex-row items-center justify-center bg-reddit-dark text-xl">
        You do not have permission to access this resource.
      </div>
    )
  }

  return (
    <div className="flex-1">
      {isEmpty ? (
        <p className="text-center text-base">You have not upvoted any post!</p>
      ) : (
        <InfiniteScroll
          dataLength={upvotedPosts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<LoadingRow />}
          endMessage={<p className="mx-auto my-2 w-full text-center text-base">You have reached the end.</p>}
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <main className="flex flex-1 flex-col gap-y-2">
            {upvotedPosts?.map((postId, index) => <PostCard id={postId} subViewFlag={true} key={index} />)}
          </main>
        </InfiniteScroll>
      )}
    </div>
  )
}

export default Page
