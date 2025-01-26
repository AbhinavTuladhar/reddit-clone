import { Types } from 'mongoose'

export interface UserBioChangeBody {
  name: string
  bio: string
}

export interface ContentId {
  _id: string
  createdAt: string
}

export interface VotedPosts {
  upvotedIds: string[]
  downvotedIds: string[]
}

export interface ContentWithType extends Omit<ContentId, '_id'> {
  _id: Types.ObjectId
  type: 'post' | 'comment'
  postId?: Types.ObjectId
}

export interface UserComment extends Omit<ContentId, '_id'> {
  _id: Types.ObjectId
  postId: Types.ObjectId
}

export interface SpecificContentId extends ContentId {
  type: 'post' | 'comment'
  postAuthor?: string
  postSubreddit?: string
  postTitle?: string
  postId?: string
}

export interface UserOverviewResponse {
  posts: ContentId[]
  comments: ContentId[]
  overview: SpecificContentId[]
}

export { UserType } from '@/models/User'
