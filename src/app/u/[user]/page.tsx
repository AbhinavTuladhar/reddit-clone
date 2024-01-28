'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { SpecificContentId } from '@/types/types'
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
  const [isEmpty, setIsEmpty] = useState(false)
  const [index, setIndex] = useState<number>(10)

  useEffect(() => {
    // console.log('For the user', userName)
    const fetchData = async () => {
      const response = await axios.get<SpecificContentId[]>(`/api/u/${userName}/overview?offset=0&limit=10`)
      if (response.data.length === 0) {
        setIsEmpty(true)
      }
      if (response.data.length < 10) {
        setHasMore(false)
      }
      setUserData(response.data)
    }
    fetchData()
    // setIndex(10)
  }, [userName])

  const fetchMoreData = async () => {
    // console.log('The value of index before fetching is ', index)
    const response = await axios.get<SpecificContentId[]>(`/api/u/${userName}/overview?offset=${index}&limit=10`)
    const overviewData = response.data
    setUserData((prevData) => [...prevData, ...overviewData])
    overviewData.length > 0 ? setHasMore(true) : setHasMore(false)
    setIndex((prevIndex) => prevIndex + 10)
  }

  return (
    <div className="flex-1">
      {isEmpty ? (
        <p className="text-center text-base">Nothing to see here.</p>
      ) : (
        <InfiniteScroll
          dataLength={userData.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<LoadingRow />}
          endMessage={<p className="mx-auto my-2 w-full text-center text-base">You have reached the end.</p>}
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <main className="flex flex-col gap-y-2">
            {userData.map((content, index) => {
              const { _id, type, postAuthor, postSubreddit = '', postTitle = '', postId = '' } = content

              if (type === 'post') {
                return <PostCard id={_id} subViewFlag={true} key={index} />
              }

              return (
                <div key={index} className="border border-transparent duration-300 hover:border-white">
                  <CommentHeader
                    postAuthor={postAuthor}
                    postSubreddit={postSubreddit}
                    postTitle={postTitle}
                    postId={postId}
                    userName={userName}
                  />
                  <section
                    className={`${
                      type === 'comment' && 'pb-2 pl-2'
                    } border border-transparent bg-reddit-dark duration-300 hover:cursor-pointer hover:border-white`}
                    key={index}
                  >
                    <Link href={`/r/${postSubreddit}/comments/${postId}`}>
                      <CommentCard _id={_id} showReply={false} />
                    </Link>
                  </section>
                </div>
              )
            })}
          </main>
        </InfiniteScroll>
      )}
    </div>
  )
}

export default Page
