import { useState } from 'react'
import { Types } from 'mongoose'

import CommentService from '@/services/comment.service'
import PostService from '@/services/post.service'
import { ResourceType, voteStatus, VotingRequestBodyWithId } from '@/types'
import { useMutation } from '@tanstack/react-query'

interface VoteProps {
  author: string | undefined
  initialVoteStatus: voteStatus
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
  const [voteStatus, setVoteStatus] = useState<voteStatus>(initialVoteStatus)

  // The mutation hook for changing the votes
  const { mutate: updateVotes } = useMutation({
    mutationFn: resourceType === 'post' ? PostService.updatePostVoteCount : CommentService.updateCommentVoteCount,
    onSuccess: () => {
      refetchResource()
      console.log('The use resource vote was successful')
    },
    onError: () => {
      console.log('The use resource vote failed')
    },
  })

  const handleVoteChange = async (targetStatus: voteStatus) => {
    if (status !== 'authenticated') {
      alert('Please login to vote.')
      return
    }

    let newVoteStatus: voteStatus = 'nonvoted'

    if (voteStatus === targetStatus && targetStatus === 'upvoted') {
      newVoteStatus = 'nonvoted'
      setVoteStatus('nonvoted')
    } else if (voteStatus === targetStatus && targetStatus === 'downvoted') {
      newVoteStatus = 'nonvoted'
      setVoteStatus('nonvoted')
    } else if (targetStatus === 'upvoted' && voteStatus === 'nonvoted') {
      newVoteStatus = 'upvoted'
      setVoteStatus('upvoted')
    } else if (targetStatus === 'downvoted' && voteStatus === 'nonvoted') {
      newVoteStatus = 'downvoted'
      setVoteStatus('downvoted')
    } else if (targetStatus === 'downvoted' && voteStatus === 'upvoted') {
      newVoteStatus = 'downvoted'
      setVoteStatus('downvoted')
    } else if (targetStatus === 'upvoted' && voteStatus === 'downvoted') {
      newVoteStatus = 'upvoted'
      setVoteStatus('upvoted')
    }

    const requestBody: VotingRequestBodyWithId = {
      user: userName,
      voteTarget: newVoteStatus,
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
