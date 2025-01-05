import { Types } from 'mongoose'

export interface CommentEditBody {
  userName: string
  content: string
}

export interface CommentCreationBody {
  content: string
  author: string
  post: Types.ObjectId
  parentComment?: string
}

export { CommentType } from '@/models/Comment'
