'use client'

import React, { useState, useEffect } from 'react';
import useFetch from '@/utils/useFetch';
import { SubredditType, PostType } from '@/types/types'
import PostCard from '@/components/PostCard';
import axios from 'axios'
import Link from 'next/link';

interface SubredditParams {
  params: {
    subreddit: string;
  }
}

const Page: React.FC<SubredditParams> = ({ params }) => {
  const subredditName = params.subreddit;


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
      console.log(postInfo)
    }
    fetchPostDetails()
  }, [])

  return (
    <div>
      {subredditName}
      <div className='flex flex-col gap-y-0'>
        {postDetails?.map(post => (
          <Link href={`/r/${post.subreddit}/${post._id}`}>
            <PostCard {...post} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
