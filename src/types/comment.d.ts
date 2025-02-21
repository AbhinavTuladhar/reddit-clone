import { Types } from 'mongoose'

import { CommentType } from '@/models/Comment'

export interface CommentEditBody {
  userName: string
  content: string
}

export interface CommentEditBodyWithId extends CommentEditBody {
  commentId: Types.ObjectId
}

export interface CommentCreationBody {
  content: string
  author: string
  post: Types.ObjectId
  parentComment?: string
}

export interface CommentTypeNew extends Omit<CommentType, 'upvotedBy' | 'downvotedBy'> {
  voteStatus: VoteStatus
  effectiveKarma: number
}

export { CommentType }
