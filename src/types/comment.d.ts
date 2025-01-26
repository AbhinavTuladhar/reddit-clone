import { Types } from 'mongoose'

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

export { CommentType } from '@/models/Comment'
