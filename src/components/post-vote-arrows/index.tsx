import React, { useEffect } from 'react'
import classNames from 'classnames'
import { Types } from 'mongoose'
import { PiArrowFatDownFill, PiArrowFatUpFill } from 'react-icons/pi'

import useCurrentUser from '@/hooks/useCurrentUser'
import useResourceVote from '@/hooks/useResourceVote'
import { voteStatus } from '@/types'

interface PostVoteArrowProps {
  postId: Types.ObjectId
  initialVoteStatus: voteStatus
  author: string
  upvotedBy: string[]
  downvotedBy: string[]
  refetch: () => void
}

const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

const PostVoteArrows: React.FC<PostVoteArrowProps> = ({
  postId,
  initialVoteStatus,
  author,
  upvotedBy,
  downvotedBy,
  refetch,
}) => {
  const effectiveKarma = upvotedBy.length + downvotedBy.length === 0 ? 1 : upvotedBy.length - downvotedBy.length + 1

  const { status, userName } = useCurrentUser()

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
        className={classNames(
          { 'text-reddit-placeholder-gray': voteStatus === 'nonvoted' },
          { 'text-reddit-orange': voteStatus === 'upvoted' },
          { 'text-indigo-400': voteStatus === 'downvoted' },
        )}
      >
        {effectiveKarma < 0 ? 0 : effectiveKarma}
      </span>
      <PiArrowFatDownFill
        className={classNames(
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

export default PostVoteArrows
