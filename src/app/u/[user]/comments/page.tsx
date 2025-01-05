'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

import CommentCard from '@/components/CommentCard'
import CommentHeader from '@/components/CommentHeader'
import LoadingRow from '@/components/LoadingRow'
import { SpecificContentId } from '@/types'

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
      const response = await axios.get<CommentDetails[]>(`/api/u/${userName}/comments?offset=0&limit=10`)
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
    const response = await axios.get<CommentDetails[]>(`/api/u/${userName}/comments?offset=${index}&limit=10`)
    const userCommentsData = response.data
    setUserComments((prevData) => [...prevData, ...userCommentsData])
    userCommentsData.length > 0 && !isEmpty ? setHasMore(true) : setHasMore(false)
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
          endMessage={<p className="mx-auto my-2 w-full text-center text-base">You have seen all comments!</p>}
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <main className="flex flex-1 flex-col gap-y-2">
            {userComments?.map((comment, index) => {
              const { _id, postAuthor, postId, postSubreddit, postTitle } = comment
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
                    className="border border-transparent bg-reddit-dark pb-2 pl-2 duration-300 hover:cursor-pointer hover:border-white"
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
