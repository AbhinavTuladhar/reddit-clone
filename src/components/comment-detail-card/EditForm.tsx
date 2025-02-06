import React, { FC, useState } from 'react'
import { Types } from 'mongoose'
import { toast } from 'react-toastify'

import useCurrentUser from '@/hooks/useCurrentUser'
import CommentService from '@/services/comment.service'
import { CommentEditBodyWithId } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface EditFormProps {
  currentComment: string
  commentId: Types.ObjectId
  toggleEditing: () => void
}

const EditForm: FC<EditFormProps> = ({ currentComment, toggleEditing, commentId }) => {
  const queryClient = useQueryClient()

  const { userName } = useCurrentUser()

  const [editedComment, setEditedComment] = useState(currentComment)

  const { mutate: editComment } = useMutation({
    mutationFn: CommentService.editComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comment', commentId],
      })
      toast.success('Successfully edited the comment.')
      console.log('Comment successfully edited.')
    },
    onError: (error) => {
      toast.error('Failed toe edit the comment')
      console.error(error)
    },
  })

  const handleEditedCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event
    setEditedComment(value)
  }

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const requestBody: CommentEditBodyWithId = {
      content: editedComment,
      userName: userName,
      commentId: commentId,
    }
    editComment(requestBody)
    toggleEditing()
  }

  return (
    <form className="flex flex-1 flex-col gap-y-2" onSubmit={handleEditSubmit}>
      <textarea
        className="h-32 w-full resize-none border-[1px] border-reddit-border bg-reddit-dark px-4 py-2 placeholder:text-reddit-placeholder-gray"
        placeholder="What are your thoughts?"
        value={editedComment}
        onChange={handleEditedCommentChange}
      />
      <div className="-mt-1.5 flex flex-row justify-end gap-x-3 bg-reddit-gray px-2 py-1">
        <button
          className="rounded-full px-2 py-1 text-sm text-white hover:bg-reddit-hover-gray"
          onClick={() => {
            toggleEditing()
            setEditedComment(currentComment)
          }}
        >
          Cancel
        </button>
        <button
          className="rounded-full bg-white px-2 py-1 text-sm enabled:text-black disabled:text-gray-400 disabled:hover:cursor-not-allowed"
          disabled={editedComment === ''}
          type="submit"
        >
          Save edits
        </button>
      </div>
    </form>
  )
}

export default EditForm
