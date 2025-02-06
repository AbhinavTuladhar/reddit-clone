'use client'

import React, { FC, FormEvent, useState } from 'react'
import { Types } from 'mongoose'
import { toast } from 'react-toastify'

import useCurrentUser from '@/hooks/useCurrentUser'
import CommentService from '@/services/comment.service'
import { CommentCreationBody } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface ReplyFormProps {
  toggleVisibility: () => void
  postId: Types.ObjectId
  parentCommentId: Types.ObjectId
}

const ReplyForm: FC<ReplyFormProps> = ({ toggleVisibility, postId, parentCommentId }) => {
  const queryClient = useQueryClient()
  const { userName } = useCurrentUser()

  const [reply, setReply] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event
    setReply(value)
  }

  const { mutate: postComment } = useMutation({
    mutationFn: CommentService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comment', parentCommentId],
      })
      toast.success('Reply successfully created.')
      console.log('Reply successfully created.')
    },
    onError: (error) => {
      toast.error('Failed to reply to the comment.')
      console.error(error)
    },
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const requestBody: CommentCreationBody = {
      content: reply,
      author: userName,
      post: postId,
      parentComment: parentCommentId.toString(),
    }

    postComment(requestBody)
    // postComment()
    setReply('')
    toggleVisibility()
  }

  return (
    <form className="flex flex-1 flex-col gap-y-2" onSubmit={handleSubmit}>
      <textarea
        className="h-32 w-full resize-none border-[1px] border-reddit-border bg-reddit-dark px-4 py-2 placeholder:text-reddit-placeholder-gray"
        placeholder="What are your thoughts?"
        onChange={handleChange}
        value={reply}
      />
      <div className="-mt-1.5 flex flex-row justify-end gap-x-3 bg-reddit-gray px-2 py-1">
        <button
          className="rounded-full px-2 py-1 text-sm text-white hover:bg-reddit-hover-gray"
          onClick={toggleVisibility}
        >
          Cancel
        </button>
        <button
          className="rounded-full bg-white px-2 py-1 text-sm enabled:text-black disabled:text-gray-400 disabled:hover:cursor-not-allowed"
          disabled={reply === ''}
          type="submit"
        >
          Comment
        </button>
      </div>
    </form>
  )
}

export default ReplyForm
