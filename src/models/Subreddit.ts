import { Schema, model, models } from "mongoose";

const SubredditSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  rules: [
    { type: String }
  ],
  subscribers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default models.Subreddit || model('Subreddit', SubredditSchema)