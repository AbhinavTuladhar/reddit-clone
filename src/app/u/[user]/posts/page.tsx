'use client'

import React, { useState, useEffect } from 'react'
import { UserOverviewResponse, ContentId } from '@/types/types'
import PostCard from '@/components/PostCard'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import LoadingRow from '@/components/LoadingRow'

interface UserParams {
  params: {
    user: string
  }
}

const Page: React.FC<UserParams> = ({ params }) => {
  const userName = params.user

  const [userPosts, setUserPosts] = useState<ContentId[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [index, setIndex] = useState(5)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<UserOverviewResponse>(`/api/u/${userName}/overview?offset=0&limit=5`)
      setUserPosts(response.data.posts)
    }
    fetchData()
  }, [userName])

  const fetchMoreData = async () => {
    const response = await axios.get<UserOverviewResponse>(`/api/u/${userName}/overview?offset=${index}&limit=5`)
    const userPostsData = response.data.posts
    setUserPosts(prevData => (
      [...prevData, ...userPostsData]
    ))
    userPostsData.length > 0 ? setHasMore(true) : setHasMore(false)
    setIndex(prevIndex => prevIndex + 5)
  }

  return (
    <div className='flex-1'>
      <InfiniteScroll
        dataLength={userPosts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<LoadingRow />}
        endMessage={
          <p className='w-full mx-auto my-2 text-lg text-center'>
            You have seen all posts!
          </p>
        }
        style={{ height: '100%', overflow: 'hidden' }}
      >
        <main className='flex flex-col flex-1 gap-y-2'>
          {userPosts?.map((post, index) => (
            <PostCard id={post._id} subViewFlag={true} key={index} />
          ))}
        </main>
      </InfiniteScroll>
    </div>
  )
}

export default Page