'use client'

import React, { useState, useEffect } from 'react'
import { SubredditType, PostType } from '@/types/types'
import PostCard from '@/components/PostCard'
import SubIcon from '../../../images/subreddit_icon.png'
import Image from 'next/image'
import formatSubName from '@/utils/formatSubName'
import CreatePostCard from '@/components/CreatePostCard'
import AboutCommunity from '@/components/AboutCommunity'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import axios from 'axios'
import { JoinSubBody } from '@/types/types'
import classnames from 'classnames'
import { Types } from 'mongoose'

interface SubredditParams {
  params: {
    subreddit: string
  }
}

type JoinStatusType = 'Join' | 'Joined'

interface PostTypeWithId extends PostType {
  _id: Types.ObjectId
}

const Page: React.FC<SubredditParams> = ({ params }) => {
  const subredditName = params.subreddit
  const formattedSubredditName = formatSubName(subredditName)
  const session = useSession()
  const { status } = session
  const userName = session?.data?.user?.name || ''

  const fetcher = (url: string) => axios.get(url).then((response) => response.data)
  const multiFetcher = (urls: string[]) => {
    return Promise.all(urls.map((url) => fetcher(url)))
  }

  // For some reason multifethcer function all of a sudden started showing an error (:|
  const { data: subInfo, mutate: mutateSubInfo } = useSWR<SubredditType | null>(`/api/r/${subredditName}`, fetcher)
  const { data: postDetails } = useSWR<PostTypeWithId[]>(
    subInfo ? subInfo.posts.map((post) => `/api/post/${post.toString()}`) : [],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    multiFetcher,
  )

  // Check if the user has jointed the sub
  const initialJoinStatus: JoinStatusType = subInfo?.subscribers?.includes(userName) ? 'Joined' : 'Join'
  const [joinStatus, setJoinStatus] = useState<JoinStatusType>(initialJoinStatus)

  useEffect(() => {
    setJoinStatus(initialJoinStatus)
  }, [initialJoinStatus])

  const handleJoin = async () => {
    const patchRequestBody: JoinSubBody = {
      subreddit: subredditName,
      userName: userName,
    }
    await axios.patch('/api/r/join', patchRequestBody)
    setJoinStatus((prevStatus) => (prevStatus === 'Join' ? 'Joined' : 'Join'))
    mutateSubInfo()
  }

  return (
    <div>
      <div className="box-border h-20 w-full bg-reddit-blue"> </div>
      <section className="-ml-0 flex w-full flex-row gap-x-2 bg-reddit-gray pl-6">
        <Image src={SubIcon} className="mt-0 h-16 w-16 rounded-full border-4 sm:-mt-5 sm:h-20 sm:w-20" alt="sub icon" />
        <div className="my-1 flex flex-1 flex-col justify-center gap-y-1">
          <div className="flex flex-row flex-wrap items-center justify-between gap-4 sm:justify-start">
            <h1 className="hidden text-2xl font-bold sm:block">{formattedSubredditName}</h1>
            <small className="block text-base font-bold sm:hidden">{`r/${subredditName}`}</small>
            {status === 'authenticated' && (
              <button
                className={classnames(
                  'mr-2 flex items-center rounded-full px-2 py-1 text-base font-bold hover:cursor-pointer sm:px-6',
                  {
                    'bg-reddit-white text-black duration-300 hover:brightness-90': joinStatus === 'Join',
                  },
                  {
                    'border border-reddit-white bg-transparent text-reddit-white': joinStatus === 'Joined',
                  },
                )}
                onClick={handleJoin}
              >
                {joinStatus}
              </button>
            )}
          </div>
          <small className="hidden text-base font-bold sm:block">{`r/${subredditName}`}</small>
        </div>
      </section>

      <div className={`my-4 flex flex-col-reverse gap-4 lg:flex-row`}>
        <div className="flex flex-1 flex-col gap-y-0">
          {status === 'authenticated' && (
            <div className="mb-4 flex flex-col gap-y-4">
              <CreatePostCard />
            </div>
          )}
          {postDetails?.map((post, index) => <PostCard id={post._id.toString()} subViewFlag={false} key={index} />)}
        </div>
        <section className="w-full lg:w-80">
          <AboutCommunity subName={subredditName} />
        </section>
      </div>
    </div>
  )
}

export default Page
