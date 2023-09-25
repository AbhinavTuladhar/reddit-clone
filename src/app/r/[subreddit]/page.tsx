'use client'

import React, { useState, useEffect } from 'react';
import useFetch from '@/utils/useFetch';
import { SubredditType, PostType } from '@/types/types'
import PostCard from '@/components/PostCard';
import axios from 'axios'
import SubIcon from '../../../images/subreddit_icon.png'
import Image from 'next/image';
import formatSubName from '@/utils/formatSubName';
import CreatePostCard from '@/components/CreatePostCard';
import AboutCommunity from '@/components/AboutCommunity';
import { useSession } from 'next-auth/react';

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

  const [postDetails, setPostDetails] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPostDetails = async () => {
      // First get the response of the subreddit api
      const subInfo: SubredditType = await axios.get(`/api/r/${subredditName}`).then(response => response.data)

      // Next query the post api
      const postInfo: PostType[] = await Promise.all(
        subInfo.posts.map(async (post: string) => await axios.get(`/api/post/${post}`).then(response => response.data))
      )

      setPostDetails(postInfo)
    }
    fetchPostDetails()
  }, [])

  return (
    <>
      <div className='bg-blue-500 w-screen h-20 -ml-4 flex-1 flex'> </div>
      <section className='flex flex-row gap-x-2 w-screen -ml-4 pl-6 bg-reddit-gray'>
        <Image
          src={SubIcon}
          className='h-24 w-24 border-4 rounded-full -mt-4'
          alt='sub icon'
        />
        <div className='flex flex-col justify-center gap-y-0.5'>
          <h1 className='text-4xl font-bold'>
            {formattedSubredditName}
          </h1>
          <h3 className='text-lg text-reddit-placeholder-gray'>
            {`r/${subredditName}`}
          </h3>
        </div>
      </section>

      {status === 'authenticated' && (
        <div className='my-4 flex flex-col gap-y-4'>
          <CreatePostCard />
        </div>
      )}
      <div className={`flex flex-row gap-x-6 ${status !== 'authenticated' && 'my-4'}`}>
        <div className='flex flex-col flex-1 gap-y-0'>
          {postDetails?.map(post => (
            <PostCard id={post._id} subViewFlag={false} />
          ))}
        </div>
        <section className='w-80 hidden lg:block'>
          <AboutCommunity subName={subredditName} />
        </section>
      </div>

    </>
  );
};

export default Page;
