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
    <div>
      <div className='w-full h-20 bg-reddit-blue box-border'> </div>
      <section className='flex flex-row w-full pl-6 -ml-0 gap-x-2 bg-reddit-gray'>
        <Image
          src={SubIcon}
          className='w-16 h-16 mt-0 sm:w-20 sm:h-20 sm:-mt-5 border-4 rounded-full'
          alt='sub icon'
        />
        <div className='flex flex-col flex-1 justify-center my-1 gap-y-1'>
          <div className='flex flex-row flex-wrap items-center justify-between sm:justify-start gap-4'>
            <h1 className='text-2xl font-bold sm:block hidden'>
              {formattedSubredditName}
            </h1>
            <small className='text-base font-bold block sm:hidden'>
              {`r/${subredditName}`}
            </small>
            {status === 'authenticated' && (
              <button
                className={classnames(
                  'flex mr-2 items-center px-2 sm:px-6 py-1 text-base font-bold rounded-full hover:cursor-pointer',
                  { 'text-black bg-reddit-white hover:brightness-90 duration-300': joinStatus === 'Join' },
                  { 'text-reddit-white bg-transparent border border-reddit-white': joinStatus === 'Joined' }
                )}
                onClick={handleJoin}>
                {joinStatus}
              </button>
            )}
          </div>
          <small className='text-base font-bold hidden sm:block'>
            {`r/${subredditName}`}
          </small>
        </div>
      </section>

      <div className={`flex flex-col-reverse lg:flex-row gap-4 my-4`}>
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
        <section className='w-full lg:w-80'>
          <AboutCommunity subName={subredditName} />
        </section>
      </div>

    </div>
  );
};

export default Page;
