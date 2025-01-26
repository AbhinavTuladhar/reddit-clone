import { voteStatus } from '@/types'

const updateVoteStatus = (initialVoteStatus: voteStatus, targetStatus: voteStatus) => {
  let newVoteStatus: voteStatus = 'nonvoted'

  if (initialVoteStatus === targetStatus && targetStatus === 'upvoted') {
    newVoteStatus = 'nonvoted'
  } else if (initialVoteStatus === targetStatus && targetStatus === 'downvoted') {
    newVoteStatus = 'nonvoted'
  } else if (targetStatus === 'upvoted' && initialVoteStatus === 'nonvoted') {
    newVoteStatus = 'upvoted'
  } else if (targetStatus === 'downvoted' && initialVoteStatus === 'nonvoted') {
    newVoteStatus = 'downvoted'
  } else if (targetStatus === 'downvoted' && initialVoteStatus === 'upvoted') {
    newVoteStatus = 'downvoted'
  } else if (targetStatus === 'upvoted' && initialVoteStatus === 'downvoted') {
    newVoteStatus = 'upvoted'
  }

  return newVoteStatus
}

export default updateVoteStatus
