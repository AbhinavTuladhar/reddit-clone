'use client'

import React, { FC, useState } from 'react'
import classNames from 'classnames'

import useCurrentUser from '@/hooks/useCurrentUser'
import useSubreddit from '@/hooks/useSubreddit'
import SubredditService from '@/services/subreddit.service'
import { JoinSubBody } from '@/types'
import { useMutation } from '@tanstack/react-query'

type JoinStatusType = 'Join' | 'Joined'

interface JoinButtonProps {
  subredditName: string
}

interface JoinButtonBodyProps {
  initialJoinStatus: JoinStatusType
  subredditName: string
}

export const SubredditJoinButton: FC<JoinButtonProps> = ({ subredditName }) => {
  const { data, isLoading, isError } = useSubreddit(subredditName)
  const { status, userName } = useCurrentUser()

  if (status === 'unauthenticated' || status === 'loading') {
    return null
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  const initialJoinStatus: JoinStatusType = data.subscribers.includes(userName) ? 'Joined' : 'Join'

  return <JoinButtonBody initialJoinStatus={initialJoinStatus} subredditName={subredditName} />
}

const JoinButtonBody: FC<JoinButtonBodyProps> = ({ initialJoinStatus, subredditName }) => {
  const [joinStatus, setJoinStatus] = useState<JoinStatusType>(initialJoinStatus)
  const { userName } = useCurrentUser()

  const { mutate } = useMutation({
    mutationFn: SubredditService.joinSubreddit,
    onSuccess: () => {
      console.log('Successfully joined the subreddit.')
    },
    onError: () => {
      console.log('Failed to join the subreddit.')
    },
  })

  const handleJoin = async () => {
    const patchRequestBody: JoinSubBody = {
      subreddit: subredditName,
      userName: userName,
    }
    mutate(patchRequestBody)
    setJoinStatus((prevStatus) => (prevStatus === 'Join' ? 'Joined' : 'Join'))
  }

  return (
    <button
      className={classNames(
        'mr-2 flex items-center rounded-full px-2 py-1 text-base font-bold hover:cursor-pointer sm:px-6',
        {
          'bg-reddit-white text-black duration-300 hover:brightness-90': joinStatus === 'Join',
        },
        {
          'border border-reddit-white bg-transparent text-reddit-white': joinStatus === 'Joined',
        },
      )}
      onClick={handleJoin}
    >
      {joinStatus}
    </button>
  )
}
