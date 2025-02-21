import { useState } from 'react'
import axios from 'axios'

import { VoteStatus } from '@/types'

interface VoteProps {
  author: string | undefined
  apiUrl: string
  initialVoteStatus: VoteStatus
  mutate: () => void
  status: string
  userName: string
}

/**
 * A custom react hook to implement voting functionality for both posts and comments
 *
 * @param {Object}   props                    The props object.
 * @param {string}   props.author             The author of the post or comment.
 * @param {string}   props.apiUrl             The api endpoint that the PATCH request is directed to.
 * @param {string}   props.initialVoteStatus  Whether the post/comment is up, down or non voted.
 * @param {function} props.mutate             The function which refetches data after making the patch request.
 * @param {string}   props.status             Whether the user is authenticated or not.
 * @param {string}   props.userName           The name of the authenticated user.
 *
 * @return {Object}                       The voting status management object.
 * @property {string}   voteStatus        The current voting status, which can be upvoted, downvoted or nonvoted.
 * @property {function} setVoteStatus     Sets the current vote status
 * @property {function} handleVoteChange  An async function for handling vote changes using PATCH request.
 */
const useVote = ({ author, apiUrl, initialVoteStatus, mutate, status, userName }: VoteProps) => {
  const [voteStatus, setVoteStatus] = useState<VoteStatus>(initialVoteStatus)

  const handleVoteChange = async (targetStatus: VoteStatus) => {
    if (status !== 'authenticated') {
      alert('Please login to vote.')
      return
    }

    let newVoteStatus: VoteStatus = 'nonvoted'

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

    const requestBody = { user: userName, voteTarget: newVoteStatus, author: author }

    await axios.patch(apiUrl, requestBody)
    mutate()
  }

  return {
    voteStatus,
    setVoteStatus,
    handleVoteChange,
  }
}

export default useVote
