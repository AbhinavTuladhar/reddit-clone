import React from 'react'
import Link from 'next/link'
import { Types } from 'mongoose'
import { toast } from 'react-toastify'

import CommentService from '@/services/comment.service'
import { useMutation } from '@tanstack/react-query'

interface CommentFormProps {
  userName: string
  postId: Types.ObjectId
  refetchComments: () => void
}

export const CommentForm: React.FC<CommentFormProps> = ({ userName, postId, refetchComments }) => {
  const [comment, setComment] = React.useState<string>('')

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event
    setComment(value)
  }

  const { mutate: createComment } = useMutation({
    mutationFn: CommentService.createComment,
    onSuccess: () => {
      toast.success('Comment successfully posted!')
      refetchComments()
    },
    onError: (error) => {
      toast.error('Failed to post the comment!')
      console.error(error)
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody = {
      content: comment,
      author: userName,
      post: postId,
    }

    createComment(requestBody)
    setComment('')
  }

  return (
    <form className="my-2 flex flex-1 flex-col gap-y-2" onSubmit={handleSubmit}>
      <span className="text-sm">
        Comment as&nbsp;
        <Link href={`/u/${userName}`} className="text-blue-500 duration-300 hover:text-red-500 hover:underline">
          {userName}
        </Link>
      </span>
      <textarea
        className="h-32 max-w-full resize-none border-[1px] border-reddit-border bg-reddit-dark px-4 py-2 placeholder:text-reddit-placeholder-gray"
        placeholder="What are your thoughts?"
        onChange={handleChange}
        value={comment}
      />
      <div className="-mt-1.5 flex flex-row justify-end bg-reddit-gray px-2 py-1">
        <button
          className="rounded-full bg-white px-2 py-1 text-sm enabled:text-black disabled:text-gray-400 disabled:hover:cursor-not-allowed"
          disabled={comment === ''}
        >
          Comment
        </button>
      </div>
    </form>
  )
}
