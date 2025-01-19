'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import SubredditIcon from '@/images/subreddit_icon.png'
import SubredditService from '@/services/subreddit.service'
import { useQuery } from '@tanstack/react-query'

const SubredditList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['popular-subreddits'],
    queryFn: SubredditService.getPopularSubs,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <section className="flex flex-col gap-y-6">
      {data.map((subreddit, index) => (
        <div className="flex flex-row items-center gap-x-4" key={index}>
          <Image src={SubredditIcon} alt="icon" className="h-10 w-10 rounded-full" />
          <div className="flex flex-col justify-between">
            <Link href={`r/${subreddit.name}`} className="text-base font-bold duration-200 hover:underline">
              {' '}
              {`r/${subreddit.name}`}{' '}
            </Link>
            <span> {`${subreddit.members} ${subreddit.members === 1 ? 'member' : 'members'}`} </span>
          </div>
        </div>
      ))}
    </section>
  )
}

export const PopularCommunities = () => {
  return (
    <div className="flex flex-col gap-y-4 rounded-lg border border-reddit-border bg-reddit-dark p-4">
      <h1 className="text-reddit-placeholder-gray"> POPULAR COMMUNITIES </h1>
      <SubredditList />
    </div>
  )
}
