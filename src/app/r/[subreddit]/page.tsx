'use client'

import React from 'react';
import { SubredditType, PostType } from '@/types/types'
import PostCard from '@/components/PostCard';
import SubIcon from '../../../images/subreddit_icon.png'
import Image from 'next/image';
import formatSubName from '@/utils/formatSubName';
import CreatePostCard from '@/components/CreatePostCard';
import AboutCommunity from '@/components/AboutCommunity';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

interface SubredditParams {
  params: {
    subreddit: string;
  }
}

const Page: React.FC<SubredditParams> = ({ params }) => {
  const subredditName = params.subreddit;
  const formattedSubredditName = formatSubName(subredditName)
  const session = useSession()
  const { status } = session

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const multiFetcher = (urls: string[]) => {
    return Promise.all(urls.map(url => fetcher(url)))
  }

  const { data: subInfo } = useSWR<SubredditType | null>(`/api/r/${subredditName}`, fetcher)
  const { data: postDetails } = useSWR<PostType[]>(
    subInfo ? subInfo.posts.map((post: string) => `/api/post/${post}`) : [],
    multiFetcher
  )

  return (
    <>
      <div className='flex flex-1 w-screen h-20 -ml-4 bg-blue-500'> </div>
      <section className='flex flex-row w-screen pl-6 -ml-4 gap-x-2 bg-reddit-gray'>
        <Image
          src={SubIcon}
          className='w-24 h-24 -mt-4 border-4 rounded-full'
          alt='sub icon'
        />
        <section className='flex flex-col justify-center gap-y-0.5'>
          <div className='flex flex-row gap-x-4'>
            <h1 className='text-4xl font-bold'>
              {formattedSubredditName}
            </h1>
            <div className='bg-reddit-white font-bold text-black text-base px-10 py-1 rounded-full hover:cursor-pointer flex items-center'>
              Join
            </div>
          </div>
          <h3 className='text-lg text-reddit-placeholder-gray'>
            {`r/${subredditName}`}
          </h3>
        </section>
      </section>

      <div className={`flex flex-row gap-x-6 my-4`}>
        <div className='flex flex-col flex-1 gap-y-0'>
          {status === 'authenticated' && (
            <div className='flex flex-col mb-4 gap-y-4'>
              <CreatePostCard />
            </div>
          )}
          {postDetails?.map(post => (
            <PostCard id={post._id} subViewFlag={false} />
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
