import { InferSchemaType, Model, model, models, Schema } from 'mongoose'

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  upvotedBy: [
    {
      type: String,
      required: true,
    },
  ],
  downvotedBy: [
    {
      type: String,
      required: true,
    },
  ],
  editedFlag: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
    default: Date.now,
  },
})

export type CommentType = InferSchemaType<typeof CommentSchema>

const Comment: Model<CommentType> = model<CommentType>('Comment', CommentSchema) || models.Comment
export default Comment
