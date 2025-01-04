import { InferSchemaType, Model, model, models, Schema } from 'mongoose'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bio: {
    type: String,
    default: '',
  },
  postKarma: {
    type: Number,
    default: 0,
  },
  commentKarma: {
    type: Number,
    default: 0,
  },
  subscribedSubs: [
    {
      type: String,
      required: true,
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  upvotedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  downvotedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  upvotedComments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  downvotedComments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
})

export type UserType = InferSchemaType<typeof UserSchema>

const User: Model<UserType> = models.User || model<UserType>('User', UserSchema)

export default User
