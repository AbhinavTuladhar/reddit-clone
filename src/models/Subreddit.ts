import { InferSchemaType, Model, model, models, Schema } from 'mongoose'

const SubredditSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  rules: [{ type: String }],
  subscribers: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
})

export type SubredditType = InferSchemaType<typeof SubredditSchema>

const Subreddit = (models.Subreddit as Model<SubredditType>) || model<SubredditType>('Subreddit', SubredditSchema)
export default Subreddit
