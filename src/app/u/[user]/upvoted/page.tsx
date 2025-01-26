'use client'

import React from 'react'

import VotedPostsList from '@/components/voted-posts-list'
import useCurrentUser from '@/hooks/useCurrentUser'

interface UserParams {
  params: {
    user: string
  }
}

const Page: React.FC<UserParams> = ({ params }) => {
  const userName = params.user
  const { userName: currentUser } = useCurrentUser()

  if (userName !== currentUser) {
    return (
      <div className="mb-4 flex h-screen flex-1 flex-row items-center justify-center bg-reddit-dark text-xl">
        You do not have permission to access this resource.
      </div>
    )
  }

  return (
    <div className="flex-1">
      <VotedPostsList userName={userName} voteType="upvoted" />
    </div>
  )
}

export default Page
