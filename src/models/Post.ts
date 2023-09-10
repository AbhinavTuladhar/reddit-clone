import { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  subreddit: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: String,
  upvotedBy: [{
    type: String,
    required: true
  }],
  downVotedBy: [{
    type: String,
    required: true
  }],
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
})

export default models.Post || model('Post', PostSchema)