import { Types } from 'mongoose'

import { PostType } from '@/models/Post'

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

export { PostType } from '@/models/Post'
