import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: {
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
    default: ''
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
      type: String,
      required: true
    }
  ],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
})

export default models.User || model('User', UserSchema)