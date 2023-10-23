import { useState } from 'react'
import { voteStatus } from "@/types/types"
import axios from 'axios'

interface CommentVoteProps {
  author: string | undefined,
  apiUrl: string,
  initialVoteStatus: voteStatus,
  mutate: () => void,
  status: string
  userName: string,
}

const useCommentVote = ({ author, apiUrl, initialVoteStatus, mutate, status, userName }: CommentVoteProps) => {
  const [voteStatus, setVoteStatus] = useState<voteStatus>(initialVoteStatus)

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

    const requestBody = { user: userName, voteTarget: newVoteStatus, author: author }

    await axios.patch(apiUrl, requestBody)
    mutate()
  }

  return {
    voteStatus,
    setVoteStatus,
    handleVoteChange,
  };
}

export default useCommentVote