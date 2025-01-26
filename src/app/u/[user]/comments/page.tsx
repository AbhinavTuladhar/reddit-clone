'use client'

import React from 'react'

import { CommentFeed } from './_components'

interface UserParams {
  params: {
    user: string
  }
}

const Page: React.FC<UserParams> = ({ params }) => {
  const userName = params.user

  return (
    <div className="flex-1">
      <CommentFeed userName={userName} />
    </div>
  )
}

export default Page
