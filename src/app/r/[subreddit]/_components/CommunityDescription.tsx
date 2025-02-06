'use client'

import React, { FC } from 'react'
import { SlPencil } from 'react-icons/sl'

import ContentRender from '@/components/content-renderer'
import useCurrentUser from '@/hooks/useCurrentUser'
import useToggle from '@/hooks/useToggle'

import { DescriptionForm } from './DescriptionForm'

interface DescriptionProps {
  creator: string
  subredditName: string
  description: string
}

/**
 * This component was put in a separate file because of more complicated logic.
 */
export const CommunityDescription: FC<DescriptionProps> = ({ creator, description, subredditName }) => {
  const { userName } = useCurrentUser()
  const { value: isEditing, toggleValue: toggleIsEditing } = useToggle(false)

  /**
   * If the current user is NOT the creator of the subreddit, then show either the description or 'no description' text
   */
  if (userName !== creator) {
    return description === '' ? (
      <div className="tracking-tight">No description</div>
    ) : (
      <ContentRender content={description} />
    )
  }

  /**
   * Description is empty and the current user is the creator of the subreddit.
   * Action: allow editing
   */
  if (description === '' && !isEditing) {
    return (
      <div
        className="flex flex-row border border-black bg-reddit-gray px-2 py-1 duration-300 hover:cursor-pointer hover:border-slate-100"
        onClick={toggleIsEditing}
      >
        <span className="tracking-tight"> Add a description</span>
      </div>
    )
  }

  // If the current user is the creator and the description is not empty
  return (
    <div className="flex flex-row gap-x-2">
      {isEditing ? (
        <DescriptionForm
          initialDescription={description}
          subredditName={subredditName}
          toggleEditing={toggleIsEditing}
        />
      ) : (
        <>
          <ContentRender content={description} />
          <SlPencil onClick={toggleIsEditing} className="hover:cursor-pointer" />
        </>
      )}
    </div>
  )
}
