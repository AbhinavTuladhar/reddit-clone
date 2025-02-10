import React, { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { MAX_SUB_DESC_LENGTH } from '@/constants'
import useCurrentUser from '@/hooks/useCurrentUser'
import UserService from '@/services/user.service'
import { UserBioChangeBody } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface FormProps {
  initialDescription: string
  toggleEditing: () => void
}

export const UserDescriptionForm: FC<FormProps> = ({ initialDescription, toggleEditing }) => {
  const queryClient = useQueryClient()
  const { userName } = useCurrentUser()

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
    mutationFn: UserService.updateUserBio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userName] })
      toast.success('Successfully changed the user bio.')
    },
    onError: () => {
      toast.error('Failed to change the user bio.')
    },
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const bioChangeBody: UserBioChangeBody = {
      bio: description,
      name: userName,
    }
    mutate(bioChangeBody)
    toggleEditing()
  }

  useEffect(() => {
    setDescription(initialDescription)
    setCharactersRemaining(MAX_SUB_DESC_LENGTH - initialDescription.length)
  }, [initialDescription])

  useEffect(() => {
    setCharactersRemaining(MAX_SUB_DESC_LENGTH - description.length)
  }, [description])

  return (
    <form className="peer flex w-full flex-col" onSubmit={handleSubmit}>
      <textarea
        className="resize-none border border-reddit-gray bg-reddit-gray p-1 placeholder:text-reddit-placeholder-gray peer-focus:border peer-focus:border-slate-100"
        placeholder="Say something about yourself."
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
