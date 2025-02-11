import React, { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { MAX_POST_LENGTH } from '@/constants'
import useCurrentUser from '@/hooks/useCurrentUser'
import PostService from '@/services/post.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const SubmissionForm: FC<{ subreddit: string }> = ({ subreddit }) => {
  const queryClient = useQueryClient()
  const { userName } = useCurrentUser()

  const initFormData = () => {
    return {
      title: '',
      body: '',
    }
  }

  const [titleLength, setTitleLength] = useState(0)
  const [postData, setPostData] = useState(initFormData())

  const { mutate } = useMutation({
    mutationFn: PostService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subreddit', subreddit] })
      toast.success('Successfully created the post.')
      setPostData(initFormData())
    },
    onError: () => {
      toast.error('Failed to create the post.')
    },
  })

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = event
    setPostData((prevState) => ({
      ...prevState,
      [name]: name === 'body' ? value : value.length <= MAX_POST_LENGTH ? value : prevState.title,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody = {
      author: userName,
      subreddit: subreddit,
      title: postData.title,
      body: postData.body,
    }
    mutate(requestBody)
  }

  useEffect(() => {
    setTitleLength(postData.title.length)
  }, [postData.title])

  return (
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
          disabled={postData.title === '' || subreddit === 'Choose a community'}
        >
          Post
        </button>
      </div>
    </form>
  )
}
