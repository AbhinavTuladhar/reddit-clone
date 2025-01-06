export interface PostCreateBody {
  author: string | null | undefined
  subreddit: string
  title: string
  body: string
}

export { PostType } from '@/models/Post'
