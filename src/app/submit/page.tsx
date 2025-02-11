'use client'

import { useState } from 'react'

import PostingRules from '@/components/PostingRules'

import { SubmissionForm, SubredditSelector } from './_components'

const Page = () => {
  const placeholderSub = 'Choose a community'
  // FOr the title text
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>(placeholderSub)

  return (
    <main className="mx-2 flex flex-row justify-between gap-x-6 md:mx-10 lg:mx-20">
      <section className="flex h-full flex-1 flex-col gap-y-4">
        <h1 className="mt-6 border-b-[1px] border-reddit-border pb-4 text-xl">Create a post</h1>
        <SubredditSelector selectedSubreddit={selectedSubreddit} setSelectedSubreddit={setSelectedSubreddit} />
        <SubmissionForm subreddit={selectedSubreddit} />
      </section>
      <PostingRules />
    </main>
  )
}

export default Page
