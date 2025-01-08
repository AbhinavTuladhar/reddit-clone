'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import classNames from 'classnames'
import classnames from 'classnames'
import { PiArrowFatDownFill, PiArrowFatUpFill } from 'react-icons/pi'

import useVote from '@/hooks/useVote'
import { voteStatus } from '@/types'

const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

interface PostVoteArrowsProps {
  effectiveKarma: number
  apiUrl: string
  author: string
  initialVoteStatus: voteStatus
  refetch: () => void
}

const VotingArrows: React.FC<PostVoteArrowsProps> = ({
  apiUrl,
  author,
  effectiveKarma,
  refetch,
  initialVoteStatus,
}) => {
  const session = useSession()
  const status = session?.status
  const userName = session?.data?.user?.name || ''

  const { handleVoteChange, voteStatus } = useVote({
    apiUrl,
    author,
    initialVoteStatus,
    userName,
    status,
    mutate: refetch,
  })

  return (
    <section className="flex flex-col items-center gap-y-1">
      <PiArrowFatUpFill
        className={classNames(
          baseIconClassName,
          { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
          { 'text-reddit-orange': voteStatus === 'upvoted' },
          'hover:text-reddit-orange',
        )}
        onClick={() => {
          handleVoteChange('upvoted')
          console.log('clicked')
        }}
      />
      <span
        className={classnames(
          { 'text-reddit-placeholder-gray': voteStatus === 'nonvoted' },
          { 'text-reddit-orange': voteStatus === 'upvoted' },
          { 'text-indigo-400': voteStatus === 'downvoted' },
        )}
      >
        {effectiveKarma < 0 ? 0 : effectiveKarma}
      </span>
      <PiArrowFatDownFill
        className={classnames(
          baseIconClassName,
          { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
          { 'text-indigo-400': voteStatus === 'downvoted' },
          'hover:text-indigo-400',
        )}
        onClick={() => handleVoteChange('downvoted')}
      />
    </section>
  )
}

export default VotingArrows
