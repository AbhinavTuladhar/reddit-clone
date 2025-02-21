import { useState } from 'react'
import { Types } from 'mongoose'
import { toast } from 'react-toastify'

import CommentService from '@/services/comment.service'
import PostService from '@/services/post.service'
import { ResourceType, VoteStatus, VotingRequestBodyWithId } from '@/types'
import updateVoteStatus from '@/utils/updateVoteStatus'
import { useMutation } from '@tanstack/react-query'

interface VoteProps {
  author: string | undefined
  initialVoteStatus: VoteStatus
  refetchResource: () => void
  status: string
  userName: string
  resourceType: ResourceType
  resourceId: Types.ObjectId
}

/**
 * A custom react hook to implement voting functionality for both posts and comments
 *
 * @param {Object}   props                    The props object.
 * @param {string}   props.author             The author of the post or comment.
 * @param {string}   props.initialVoteStatus  Whether the post/comment is up, down or non voted.
 * @param {function} props.refetchResource    The function which refetches data after making the patch request.
 * @param {string}   props.status             Whether the user is authenticated or not.
 * @param {string}   props.userName           The name of the authenticated user.
 * @param {string}   props.resourceType       Whether the target of the vote is a post or a comment.
 * @param {string}   props.resourceId         The id of either the comment or the post.
 *
 * @return {Object}                       The voting status management object.
 * @property {string}   voteStatus        The current voting status, which can be upvoted, downvoted or nonvoted.
 * @property {function} setVoteStatus     Sets the current vote status
 * @property {function} handleVoteChange  An async function for handling vote changes using PATCH request.
 */
const useResourceVote = ({
  author,
  initialVoteStatus,
  refetchResource,
  resourceId,
  resourceType,
  status,
  userName,
}: VoteProps) => {
  const [voteStatus, setVoteStatus] = useState<VoteStatus>(() => initialVoteStatus)

  // The mutation hook for changing the votes
  const { mutate: updateVotes } = useMutation({
    mutationFn: resourceType === 'post' ? PostService.updatePostVoteCount : CommentService.updateCommentVoteCount,
    onSuccess: () => {
      refetchResource()
      toast.success(`Successfully voted on ${resourceType}`)
      console.log('The use resource vote was successful')
    },
    onError: () => {
      toast.error(`Failed to vote on ${resourceType}`)
      console.error('The use resource vote failed')
    },
  })

  const handleVoteChange = async (targetStatus: VoteStatus) => {
    if (status !== 'authenticated') {
      toast.info('Please login to vote.')
      return
    }

    const updatedVoteStatus = updateVoteStatus(voteStatus, targetStatus)
    setVoteStatus(updatedVoteStatus)

    // Ignore the vote if the user is targeting their own post or comment
    if (author === userName) {
      return
    }

    const requestBody: VotingRequestBodyWithId = {
      user: userName,
      voteTarget: updatedVoteStatus,
      author: author || '',
      resourceId,
    }

    updateVotes(requestBody)
  }

  return {
    voteStatus,
    setVoteStatus,
    handleVoteChange,
  }
}

export default useResourceVote
