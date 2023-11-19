'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import CreatePostCard from '@/components/CreatePostCard'
import PostCard from '@/components/PostCard'
import HomeSidebar from '@/components/HomeSidebar'
import PopularCommunities from '@/components/PopularCommunities'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios'
import LoadingRow from '@/components/LoadingRow'

export default function Home() {
  const [postIds, setPostIds] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [index, setIndex] = useState(10)

  const { status } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<string[]>(`/api/home?offset=0&limit=10`)
      setPostIds(response.data)
    }
    fetchData()
  }, [])

  const fetchMoreData = async () => {
    const response = await axios.get<string[]>(`/api/home?offset=${index}&limit=10`)
    setPostIds(prevIds => (
      [...prevIds, ...response.data]
    ))
    response.data.length > 0 ? setHasMore(true) : setHasMore(false)
    setIndex(prevIndex => prevIndex + 10)
  }

  return (
    <div className='flex flex-col-reverse gap-4 mt-4 lg:flex-row'>
      <div className='flex flex-col flex-1'>
        {status === 'authenticated' && (
          <section className='mb-4'>
            <CreatePostCard />
          </section>
        )}
        <InfiniteScroll
          dataLength={postIds.length}
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
          <main className='flex flex-col gapy-y-0'>
            {postIds?.map((postId: string, index) => (
              <PostCard id={postId} subViewFlag={true} key={index} />
            ))}
          </main>
        </InfiniteScroll>
      </div>
      <section className='flex flex-col w-full lg:w-80 gap-y-4'>
        {status === 'authenticated' && (
          <div className='hidden lg:block'>
            <HomeSidebar />
          </div>
        )}
        <div className='sticky top-16'>
          <PopularCommunities />
        </div>
      </section>
    </div>
  )
}
