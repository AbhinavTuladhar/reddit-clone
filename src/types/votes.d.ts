import { Types } from 'mongoose'

export type voteStatus = 'upvoted' | 'nonvoted' | 'downvoted'

export type SimpleVoteStatus = 'upvoted' | 'downvoted'

export type ResourceType = 'post' | 'comment'

export interface VotingRequestBody {
  user: string
  author: string
  voteTarget: voteStatus
}

export interface VotingRequestBodyWithId extends VotingRequestBody {
  resourceId: Types.ObjectId
}

export interface VotedPostsResponse {
  upvotedIds: string[]
  downvotedIds: string[]
}
