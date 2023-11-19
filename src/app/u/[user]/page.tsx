'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserOverviewResponse, SpecificContentId } from '@/types/types'
import CommentCard from '@/components/CommentCard'
import PostCard from '@/components/PostCard'
import CommentHeader from '@/components/CommentHeader'
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

  const [userData, setUserData] = useState<SpecificContentId[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [index, setIndex] = useState(5)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<UserOverviewResponse>(`/api/u/${userName}/overview`)
      setUserData(response.data.overview)
    }
    fetchData()
  }, [])

  const fetchMoreData = async () => {
    const response = await axios.get<UserOverviewResponse>(`/api/u/${userName}/overview?offset=${index}&limit=5`)
    const overviewData = response.data.overview
    setUserData(prevData => (
      [...prevData, ...overviewData]
    ))
    overviewData.length > 0 ? setHasMore(true) : setHasMore(false)
    setIndex(prevIndex => prevIndex + 5)
  }

  return (
    <div className='flex-1'>
      <InfiniteScroll
        dataLength={userData.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<LoadingRow />}
        endMessage={
          <p className='w-full mx-auto my-2 text-lg text-center'>
            You have reached the end.
          </p>
        }
        style={{ height: '100%', overflow: 'hidden' }}
      >
        <main className='flex flex-col gap-y-2'>
          {userData.map((content, index) => {
            const { _id, type, postAuthor, postSubreddit = '', postTitle = '', postId = '' } = content

            if (type === 'post') {
              return <PostCard id={_id} subViewFlag={true} key={index} />
            }

            return (
              <div key={index} className='duration-300 border border-transparent hover:border-white'>
                <CommentHeader postAuthor={postAuthor} postSubreddit={postSubreddit} postTitle={postTitle} postId={postId} userName={userName} />
                <section className={`${type === 'comment' && 'pl-2 pb-2'} bg-reddit-dark border border-transparent hover:border-white hover:cursor-pointer duration-300`} key={index}>
                  <Link href={`/r/${postSubreddit}/comments/${postId}`}>
                    <CommentCard id={_id} showReply={false} />
                  </Link>
                </section>
              </div>
            )
          })}
        </main>
      </InfiniteScroll>
    </div>
  )
}

export default Page