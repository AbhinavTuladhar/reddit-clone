import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

export default models.Comment || model('Comment', CommentSchema)