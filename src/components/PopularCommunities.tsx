'use client'

import React from 'react'
import axios from 'axios'
import useSWR from 'swr'
import Image from 'next/image'
import SubredditIcon from '../images/subreddit_icon.png'
import Link from 'next/link'

interface PopularSubsType {
  name: string
  members: number
}
const PopularCommunities = () => {
  const fetcher = (url: string) => axios.get(url).then((response) => response.data)
  const { data: popularSubs } = useSWR<PopularSubsType[]>('/api/popular', fetcher)

  return (
    <div className="flex flex-col gap-y-4 rounded-lg border border-reddit-border bg-reddit-dark p-4">
      <h1 className="text-reddit-placeholder-gray"> POPULAR COMMUNITIES </h1>
      <section className="flex flex-col gap-y-6">
        {popularSubs?.map((subreddit, index) => (
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
    </div>
  )
}

export default PopularCommunities
