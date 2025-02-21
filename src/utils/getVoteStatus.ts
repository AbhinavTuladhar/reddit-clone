import { VoteStatus } from '@/types'

interface VoteStatusProps {
  userName: string
  author: string
  upvotedBy: string[]
  downvotedBy: string[]
}

const getVoteStatus = ({ author, upvotedBy, downvotedBy, userName }: VoteStatusProps) => {
  let initialVoteStatus: VoteStatus = 'nonvoted'

  if (upvotedBy.includes(userName) || author === userName) {
    initialVoteStatus = 'upvoted'
  } else if (downvotedBy.includes(userName)) {
    initialVoteStatus = 'downvoted'
  } else {
    initialVoteStatus = 'nonvoted'
  }

  return initialVoteStatus
}

export default getVoteStatus
