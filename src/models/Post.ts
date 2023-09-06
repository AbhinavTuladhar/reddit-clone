import { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subreddit: {
    type: Schema.Types.ObjectId,
    ref: 'Subreddit',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: String,
  upvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downVotedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
})

export default models.Post || model('Post', PostSchema)