import { InferSchemaType, Model, model, models, Schema } from 'mongoose'

const PostSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  subreddit: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
})

export type PostType = InferSchemaType<typeof PostSchema>

const Post = (models.Post as Model<PostType>) || model<PostType>('Post', PostSchema)
export default Post
