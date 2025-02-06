'use client'

import React from 'react'

import CreatePostCard from '@/components/CreatePostCard'
import useCurrentUser from '@/hooks/useCurrentUser'

import { AboutCommunity } from './_components'
import { SubredditFeed, SubredditHeader } from './_components'

interface SubredditParams {
  params: {
    subreddit: string
  }
}

const Page: React.FC<SubredditParams> = ({ params }) => {
  const subredditName = params.subreddit
  const { status } = useCurrentUser()

  return (
    <div>
      <SubredditHeader subredditName={subredditName} />
      <div className={`my-4 flex flex-col-reverse gap-4 lg:flex-row`}>
        <div className="flex flex-1 flex-col gap-y-0">
          {status === 'authenticated' && (
            <div className="mb-4 flex flex-col gap-y-4">
              <CreatePostCard />
            </div>
          )}
          <SubredditFeed subredditName={subredditName} />
        </div>
        <section className="w-full lg:w-80">
          <AboutCommunity subName={subredditName} />
        </section>
      </div>
    </div>
  )
}

export default Page
