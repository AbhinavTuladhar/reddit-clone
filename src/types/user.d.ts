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
