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
  const characterLimit = 300

  const initFormData = () => {
    return {
      title: '',
      body: ''
    }
  }

  // FOr the title text
  const [titleLength, setTitleLength] = useState(0)
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>(placeholderSub)
  const [postData, setPostData] = useState(initFormData())

  const { data, error, isLoading } = useFetch<SubListResponse[]>('/api/r')
  const subredditList = data?.map(row => `r/${row.name}`)

  useEffect(() => {
    setTitleLength(postData.title.length)
  }, [postData.title])

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target: { name, value } } = event
    setPostData(prevState => ({
      ...prevState,
      [name]: name === 'body' ? value : (value.length <= characterLimit ? value : prevState.title)
    }))
  }

  return (
    <main className='flex flex-row justify-between gap-x-6 mx-2 md:mx-10 lg:mx-20'>
      <section className='flex flex-col flex-1 gap-y-4'>
        <h1 className='mt-6 pb-4 text-xl border-b-[1px] border-reddit-border'>
          Create a post
        </h1>
        <PostSubredditSelector subredditList={subredditList} selectedSubreddit={selectedSubreddit} setSelectedSubreddit={setSelectedSubreddit} />
        <form className='flex flex-col gap-y-4'>
          <div className='relative w-full'>
            <input
              className='w-full h-12 p-2 pr-20 border-[1px] border-reddit-border bg-reddit-dark'
              placeholder='Title'
              type='text'
              value={postData.title}
              name='title'
              onChange={handleFormChange}
            />
            <span className='absolute mr-3 my-3 top-0 right-0 text-sm text-gray-600'>
              {titleLength}/300
            </span>
          </div>
          <textarea
            className='w-full p-2 h-32 border-[1px] border-reddit-border bg-reddit-dark resize-none'
            placeholder='Body (optional)'
            value={postData.body}
            name='body'
            onChange={handleFormChange}
          />
        </form>
      </section>
      <PostingRules />
    </main>
  )
}

export default page