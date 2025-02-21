import React from 'react'
import classNames from 'classnames'
import { Types } from 'mongoose'
import { PiArrowFatDownFill, PiArrowFatUpFill } from 'react-icons/pi'

import useCurrentUser from '@/hooks/useCurrentUser'
import useResourceVote from '@/hooks/useResourceVote'
import { ResourceType, VoteStatus } from '@/types'

interface PostVoteArrowProps {
  postId: Types.ObjectId
  initialVoteStatus: VoteStatus
  author: string
  effectiveKarma: number
  resourceType: ResourceType
  refetch: () => void
}

const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray'

const PostVoteArrows: React.FC<PostVoteArrowProps> = ({
  postId,
  initialVoteStatus,
  author,
  effectiveKarma,
  resourceType,
  refetch,
}) => {
  const { status, userName } = useCurrentUser()

  const { handleVoteChange, voteStatus } = useResourceVote({
    author,
    initialVoteStatus,
    refetchResource: refetch,
    resourceId: postId,
    resourceType,
    status,
    userName,
  })

  // if (postId.toString() === '67ab69405433a523a867ab25') {
  //   console.log('For the first post, the vote status is', initialVoteStatus)
  // }

  return (
    <section
      className={classNames('flex gap-x-2 gap-y-1', {
        'flex-col items-center': resourceType === 'post',
      })}
    >
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
