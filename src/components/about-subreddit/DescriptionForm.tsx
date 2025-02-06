'use state'

import React, { FC, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { MAX_SUB_DESC_LENGTH } from '@/constants'
import SubredditService from '@/services/subreddit.service'
import { SubDescChangeBody } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface FormProps {
  subredditName: string
  initialDescription: string
  toggleEditing: () => void
}

export const DescriptionForm: FC<FormProps> = ({ subredditName, initialDescription, toggleEditing }) => {
  const queryClient = useQueryClient()

  const [description, setDescription] = useState(initialDescription)
  const [charactersRemaining, setCharactersRemaining] = useState(MAX_SUB_DESC_LENGTH)

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event
    if (description.length < MAX_SUB_DESC_LENGTH) {
      setDescription(value)
    }
  }

  const { mutate } = useMutation({
    mutationFn: SubredditService.changeSubredditDescription,
    onSuccess: () => {
      toast.success('Successfully changed the subreddit description.')
      queryClient.invalidateQueries({ queryKey: ['subreddit', subredditName] })
    },
    onError: () => {
      toast.error('Failed to change the subreddit description.')
    },
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const descChangeBody: SubDescChangeBody = {
      description,
      name: subredditName,
    }
    mutate(descChangeBody)
    toggleEditing()
  }

  useEffect(() => {
    setDescription(initialDescription)
    setCharactersRemaining(MAX_SUB_DESC_LENGTH - initialDescription.length)
  }, [initialDescription, setDescription])

  useEffect(() => {
    setCharactersRemaining(MAX_SUB_DESC_LENGTH - description.length)
  }, [description])

  return (
    <form className="peer flex w-full flex-col" onSubmit={handleSubmit}>
      <textarea
        className="resize-none border border-reddit-gray bg-reddit-gray p-1 placeholder:text-reddit-placeholder-gray peer-focus:border peer-focus:border-slate-100"
        placeholder="Tell us about your community"
        value={description}
        onChange={handleChange}
      />
      <div className="mt-[1px] flex justify-between bg-reddit-gray p-1 peer-focus:border-slate-100">
        <span className="text-reddit-placeholder-gray"> {`${charactersRemaining} characters remaining`} </span>
        <div className="flex flex-row gap-x-2 text-xs">
          <button className="text-red-600" onClick={toggleEditing} type="button">
            Cancel
          </button>
          <button className="text-slate-100" type="submit">
            Save
          </button>
        </div>
      </div>
    </form>
  )
}
