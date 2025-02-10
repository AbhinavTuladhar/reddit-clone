'use client'

import React, { FC } from 'react'
import { LuCake } from 'react-icons/lu'

import useSubreddit from '@/hooks/useSubreddit'
import { formatDate } from '@/utils/date.utils'

import { CommunityDescription } from './CommunityDescription'

interface CommunityProps {
  subName: string
}

// For showing the cake day
export const CommunityCreation: FC<{ createdDate: Date }> = ({ createdDate }) => {
  const datePart = createdDate.toString().split('T')[0]
  const datePartFormatted = formatDate(datePart)

  return (
    <div className="flex flex-row items-center gap-x-2 border-b border-reddit-border pb-2">
      <LuCake className="h-6 w-6 text-white" />
      <span className="text-reddit-placeholder-gray">Created on {datePartFormatted}</span>
    </div>
  )
}

export const CommunityMemberCount: FC<{ memberCount: number }> = ({ memberCount }) => (
  <div className="flex flex-col gap-y-0">
    <h1 className="text-lg font-bold"> {memberCount} </h1>
    <small className="text-xs text-reddit-placeholder-gray"> members </small>
  </div>
)

const AboutSubreddit: React.FC<CommunityProps> = ({ subName }) => {
  const { data, isLoading, isError } = useSubreddit(subName)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  const { creator, createdAt, description, name, subscribers } = data

  return (
    <aside className="flex flex-col gap-y-2 rounded border border-reddit-border bg-reddit-dark p-2">
      <h3 className="text-base tracking-tight text-reddit-placeholder-gray">About Community</h3>
      <CommunityDescription subredditName={name} description={description} creator={creator} />
      <CommunityCreation createdDate={createdAt} />
      <CommunityMemberCount memberCount={subscribers.length} />
    </aside>
  )
}

export default AboutSubreddit
