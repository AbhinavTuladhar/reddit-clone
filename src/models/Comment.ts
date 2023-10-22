import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: {
    type: String,
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  upvotedBy: [{
    type: String,
    required: true
  }],
  downvotedBy: [{
    type: String,
    required: true
  }],
})

export default models.Comment || model('Comment', CommentSchema)