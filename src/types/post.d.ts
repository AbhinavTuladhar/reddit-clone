import { Types } from 'mongoose'

import { PostType } from '@/models/Post'

import { VoteStatus } from './votes'

export interface PostWithId extends PostType {
  _id: Types.ObjectId
  topLevelComments: Types.ObjectId[]
}

export interface PostCreateBody {
  author: string | null | undefined
  subreddit: string
  title: string
  body: string
}

export interface PostTypeNew extends Omit<PostWithId, 'upvotedBy' | 'downvotedBy'> {
  voteStatus: VoteStatus
  effectiveKarma: number
}

export { PostType }
