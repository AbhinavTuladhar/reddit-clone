export type voteStatus = 'upvoted' | 'nonvoted' | 'downvoted'

export interface VotingRequestBody {
  user: string
  author: string
  voteTarget: voteStatus
}

export interface VotedPostsResponse {
  upvotedIds: string[]
  downvotedIds: string[]
}
