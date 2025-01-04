'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import useSWR from 'swr'

import PostingRules from '@/components/PostingRules'
import PostSubredditSelector from '@/components/PostSubredditSelector'

interface SubListResponse {
  name: string
  creatorName: string
}

const Page = () => {
  const placeholderSub = 'Choose a community'
  const characterLimit = 300

  const initFormData = () => {
    return {
      title: '',
      body: '',
    }
  }

  const session = useSession()
  const userName = session?.data?.user?.name

  // FOr the title text
  const [titleLength, setTitleLength] = useState(0)
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>(placeholderSub)
  const [postData, setPostData] = useState(initFormData())

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data } = useSWR<SubListResponse[]>('/api/r', fetcher)

  const subredditList = data?.map((row) => `r/${row.name}`)

  useEffect(() => {
    setTitleLength(postData.title.length)
  }, [postData.title])

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = event
    setPostData((prevState) => ({
      ...prevState,
      [name]: name === 'body' ? value : value.length <= characterLimit ? value : prevState.title,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody = {
      author: userName,
      subreddit: selectedSubreddit.slice(2),
      title: postData.title,
      body: postData.body,
    }

    await axios.post('/api/post', requestBody)

    setPostData(initFormData())
  }

  // Checking whether the post can be made or not
  const buttonDisableFlag = postData.title === '' || selectedSubreddit === placeholderSub

  return (
    <main className="mx-2 flex flex-row justify-between gap-x-6 md:mx-10 lg:mx-20">
      <section className="flex h-full flex-1 flex-col gap-y-4">
        <h1 className="mt-6 border-b-[1px] border-reddit-border pb-4 text-xl">Create a post</h1>
        <PostSubredditSelector
          subredditList={subredditList}
          selectedSubreddit={selectedSubreddit}
          setSelectedSubreddit={setSelectedSubreddit}
        />
        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <input
              className="relative h-12 w-full border-[1px] border-reddit-border bg-reddit-dark p-2 pr-20"
              placeholder="Title"
              type="text"
              value={postData.title}
              name="title"
              onChange={handleFormChange}
              required
            />
            <span className="absolute right-0 top-0 my-3 mr-3 text-sm text-gray-600">{titleLength}/300</span>
          </div>
          <textarea
            className="h-32 w-full resize-none border-[1px] border-reddit-border bg-reddit-dark p-2"
            placeholder="Body (optional)"
            value={postData.body}
            name="body"
            onChange={handleFormChange}
          />
          <div className="flex w-full justify-end">
            <button
              className="rounded-full bg-white px-5 py-2 text-lg enabled:text-black disabled:text-gray-400"
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

export default Page
