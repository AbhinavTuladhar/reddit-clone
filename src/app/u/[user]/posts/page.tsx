'use client'

import React, { useState, useEffect } from 'react'
import { ContentId } from '@/types/types'
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
  const [isEmpty, setIsEmpty] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [index, setIndex] = useState(5)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<ContentId[]>(`/api/u/${userName}/posts?offset=0&limit=5`)
      if (response.data.length === 0) {
        setIsEmpty(true)
      }
      if (response.data.length < 5) {
        setHasMore(false)
      }
      setUserPosts(response.data)
    }
    fetchData()
  }, [userName])

  const fetchMoreData = async () => {
    const response = await axios.get<ContentId[]>(`/api/u/${userName}/posts?offset=${index}&limit=5`)
    const userPostsData = response.data
    setUserPosts((prevData) => [...prevData, ...userPostsData])
    userPostsData.length > 0 && !isEmpty ? setHasMore(true) : setHasMore(false)
    setIndex((prevIndex) => prevIndex + 5)
  }

  return (
    <div className="flex-1">
      {isEmpty ? (
        <p className="text-center text-base"> Nothing to see here</p>
      ) : (
        <InfiniteScroll
          dataLength={userPosts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<LoadingRow />}
          endMessage={<p className="mx-auto my-2 w-full text-center text-base">You have seen all posts!</p>}
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <main className="flex flex-1 flex-col gap-y-2">
            {userPosts?.map((post, index) => <PostCard id={post._id} subViewFlag={true} key={index} />)}
          </main>
        </InfiniteScroll>
      )}
    </div>
  )
}

export default Page
