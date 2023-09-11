'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import PostSubredditSelector from '@/components/PostSubredditSelector'
import PostingRules from '@/components/PostingRules'
import useFetch from '@/utils/useFetch'
import axios from 'axios'

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

  const session = useSession()
  const userName = session?.data?.user?.name

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody = {
      author: userName,
      subreddit: selectedSubreddit.slice(2),
      title: postData.title,
      body: postData.body
    }

    await axios.post('/api/post', requestBody)

    setPostData(initFormData())
  }

  // Checking whether the post can be made or not
  const buttonDisableFlag = postData.title === '' || selectedSubreddit === placeholderSub

  return (
    <main className='flex flex-row justify-between gap-x-6 mx-2 md:mx-10 lg:mx-20'>
      <section className='flex flex-col flex-1 gap-y-4 h-full'>
        <h1 className='mt-6 pb-4 text-xl border-b-[1px] border-reddit-border'>
          Create a post
        </h1>
        <PostSubredditSelector subredditList={subredditList} selectedSubreddit={selectedSubreddit} setSelectedSubreddit={setSelectedSubreddit} />
        <form className='flex flex-col gap-y-4' onSubmit={handleSubmit}>
          <div className='z-0 relative w-full'>
            <input
              className='w-full h-12 p-2 pr-20 border-[1px] border-reddit-border bg-reddit-dark relative z-0'
              placeholder='Title'
              type='text'
              value={postData.title}
              name='title'
              onChange={handleFormChange}
              required
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
          <div className='flex justify-end w-full'>
            <button
              className='bg-white disabled:text-gray-400 enabled:text-black text-lg rounded-full py-2 px-5'
              disabled={buttonDisableFlag}
            >
              Post
            </button>
          </div>
        </form>
      </section>
      <PostingRules />
    </main>
  )
}

export default page