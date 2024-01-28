'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import CommentHeader from '@/components/CommentHeader'
import CommentCard from '@/components/CommentCard'
import { SpecificContentId } from '@/types/types'
import InfiniteScroll from 'react-infinite-scroll-component'
import LoadingRow from '@/components/LoadingRow'
import axios from 'axios'

interface UserParams {
  params: {
    user: string
  }
}

type CommentDetails = Omit<SpecificContentId, 'type'>

const Page: React.FC<UserParams> = ({ params }) => {
  const userName = params.user

  const [userComments, setUserComments] = useState<CommentDetails[]>([])
  const [isEmpty, setIsEmpty] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [index, setIndex] = useState(10)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<CommentDetails[]>(
        `/api/u/${userName}/comments?offset=0&limit=10`
      )
      if (response.data.length === 0) {
        setIsEmpty(true)
      }
      if (response.data.length < 10) {
        setHasMore(false)
      }
      setUserComments(response.data)
    }
    fetchData()
  }, [userName])

  const fetchMoreData = async () => {
    const response = await axios.get<CommentDetails[]>(
      `/api/u/${userName}/comments?offset=${index}&limit=10`
    )
    const userCommentsData = response.data
    setUserComments((prevData) => [...prevData, ...userCommentsData])
    userCommentsData.length > 0 && !isEmpty
      ? setHasMore(true)
      : setHasMore(false)
    setIndex((prevIndex) => prevIndex + 10)
  }

  return (
    <div className="flex-1">
      {isEmpty ? (
        <p className="text-center text-base">No comments to show.</p>
      ) : (
        <InfiniteScroll
          dataLength={userComments.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<LoadingRow />}
          endMessage={
            <p className="w-full mx-auto my-2 text-base text-center">
              You have seen all comments!
            </p>
          }
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <main className="flex flex-col flex-1 gap-y-2">
            {userComments?.map((comment, index) => {
              const { _id, postAuthor, postId, postSubreddit, postTitle } =
                comment
              return (
                <div
                  key={index}
                  className="duration-300 border border-transparent hover:border-white"
                >
                  <CommentHeader
                    postAuthor={postAuthor}
                    postSubreddit={postSubreddit}
                    postTitle={postTitle}
                    postId={postId}
                    userName={userName}
                  />
                  <section
                    className="pb-2 pl-2 duration-300 border border-transparent bg-reddit-dark hover:border-white hover:cursor-pointer"
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
