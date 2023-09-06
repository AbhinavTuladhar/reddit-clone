import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bio: {
    type: String,
  },
  postKarma: {
    type: Number,
    default: 0,
  },
  commentKarma: {
    type: Number,
    default: 0
  },
  subscribedSubs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Subreddit'
    }
  ]
})

export default models.User || model('User', UserSchema)