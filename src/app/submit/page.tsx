'use client'

import React, { useState, useEffect } from 'react'
import PostSubredditSelector from '@/components/PostSubredditSelector'
import PostingRules from '@/components/PostingRules'
import useFetch from '@/utils/useFetch'

interface SubListResponse {
  name: string,
  creatorName: string
}

const page = () => {
  const placeholderSub = 'Choose a community'
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>(placeholderSub)
  // const [subSelectorOpen, setSubSelectorOpen] = useState(false)
  // const [subredditNames, setSubredditNames] = useState<string[]>([])

  const { data, error, isLoading } = useFetch<SubListResponse[]>('/api/r')
  console.log(data)

  const subredditList = data?.map(row => `r/${row.name}`)
  console.log(subredditList)

  return (
    <main className='flex flex-row justify-between gap-x-6 mx-2 md:mx-10 lg:mx-20'>
      <section className='flex flex-col flex-1 gap-y-4'>
        <h1 className='mt-6 pb-4 text-xl border-b-[1px] border-reddit-border'>
          Create a post
        </h1>
        <PostSubredditSelector subredditList={subredditList} selectedSubreddit={selectedSubreddit} setSelectedSubreddit={setSelectedSubreddit} />
      </section>
      <PostingRules />
    </main>
  )
}

export default page