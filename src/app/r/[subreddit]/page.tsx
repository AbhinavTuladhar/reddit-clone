'use client'

import React, { useState, useEffect } from 'react';
import { SubredditType, PostType } from '@/types/types'
import PostCard from '@/components/PostCard';
import SubIcon from '../../../images/subreddit_icon.png'
import Image from 'next/image';
import formatSubName from '@/utils/formatSubName';
import CreatePostCard from '@/components/CreatePostCard';
import AboutCommunity from '@/components/AboutCommunity';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import axios from 'axios'
import { JoinSubBody } from '@/types/types';
import classnames from 'classnames';

interface SubredditParams {
  params: {
    subreddit: string;
  }
}

type JoinStatusType = 'Join' | 'Joined'

const Page: React.FC<SubredditParams> = ({ params }) => {
  const subredditName = params.subreddit;
  const formattedSubredditName = formatSubName(subredditName)
  const session = useSession()
  const { status } = session
  const userName = session?.data?.user?.name || ''

  const fetcher = (url: string) => axios.get(url).then((response) => response.data)
  const multiFetcher = (urls: string[]) => {
    return Promise.all(urls.map(url => fetcher(url)))
  }

  // For some reason multifethcer function all of a sudden started showing an error (:|
  const { data: subInfo, mutate: mutateSubInfo } = useSWR<SubredditType | null>(`/api/r/${subredditName}`, fetcher)
  const { data: postDetails } = useSWR<PostType[]>(
    subInfo ? subInfo.posts.map((post: string) => `/api/post/${post}`) : [],
    // @ts-ignore
    multiFetcher
  )

  // Check if the user has jointed the sub
  const initialJoinStatus: JoinStatusType = subInfo?.subscribers?.includes(userName) ? 'Joined' : 'Join'
  const [joinStatus, setJoinStatus] = useState<JoinStatusType>(initialJoinStatus)

  useEffect(() => {
    setJoinStatus(initialJoinStatus)
  }, [initialJoinStatus])

  const handleJoin = async () => {
    const patchRequestBody: JoinSubBody = {
      subreddit: subredditName, userName: userName
    }
    await axios.patch('/api/r/join', patchRequestBody)
    setJoinStatus(prevStatus => (
      prevStatus === 'Join' ? 'Joined' : 'Join'
    ))
    mutateSubInfo()
  }

  return (
    <>
      <div className='flex flex-1 w-full h-20 -ml-0 bg-reddit-blue'> </div>
      <section className='flex flex-row w-full pl-6 -ml-0 gap-x-2 bg-reddit-gray'>
        <Image
          src={SubIcon}
          className='w-24 h-24 -mt-6 border-4 rounded-full'
          alt='sub icon'
        />
        <section className='flex flex-col my-2 justify-center gap-y-0.5'>
          <div className='flex flex-row flex-wrap items-center gap-4'>
            <h1 className='text-4xl font-bold'>
              {formattedSubredditName}
            </h1>
            <div
              className={classnames(
                'flex items-center px-6 py-1 text-base font-bold rounded-full hover:cursor-pointer',
                { 'text-black bg-reddit-white hover:brightness-90 duration-300': joinStatus === 'Join' },
                { 'text-reddit-white bg-transparent border border-reddit-white': joinStatus === 'Joined' }
              )}
              onClick={handleJoin}>
              {joinStatus}
            </div>
          </div>
          <small className='text-sm text-reddit-placeholder-gray'>
            {`r/${subredditName}`}
          </small>
        </section>
      </section>

      <div className={`flex flex-row gap-x-6 my-4`}>
        <div className='flex flex-col flex-1 gap-y-0'>
          {status === 'authenticated' && (
            <div className='flex flex-col mb-4 gap-y-4'>
              <CreatePostCard />
            </div>
          )}
          {postDetails?.map((post, index) => (
            <PostCard id={post._id} subViewFlag={false} key={index} />
          ))}
        </div>
        <section className='hidden w-80 lg:block'>
          <AboutCommunity subName={subredditName} />
        </section>
      </div>

    </>
  );
};

export default Page;
