'use client'

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import classNames from 'classnames'
import classnames from 'classnames'
import { Types } from 'mongoose'
import { PiArrowFatDownFill, PiArrowFatUpFill } from 'react-icons/pi'

import useResourceVote from '@/hooks/useResourceVote'
import { voteStatus } from '@/types'

const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

interface PostVoteArrowsProps {
  effectiveKarma: number
  postId: Types.ObjectId
  author: string
  initialVoteStatus: voteStatus
  refetch: () => void
}

const VotingArrows: React.FC<PostVoteArrowsProps> = ({
  author,
  effectiveKarma,
  refetch,
  initialVoteStatus,
  postId,
}) => {
  const session = useSession()
  const status = session?.status
  const userName = session?.data?.user?.name || ''

  const { handleVoteChange, voteStatus, setVoteStatus } = useResourceVote({
    author,
    initialVoteStatus,
    refetchResource: refetch,
    resourceId: postId,
    resourceType: 'post',
    status,
    userName,
  })

  // Change the arrow fill colours whenever the vote status changes
  useEffect(() => {
    setVoteStatus(initialVoteStatus)
  }, [setVoteStatus, initialVoteStatus])

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
          refetch()
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
        onClick={() => {
          handleVoteChange('downvoted')
          refetch()
        }}
      />
    </section>
  )
}

export default VotingArrows
