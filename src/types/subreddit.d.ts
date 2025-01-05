export interface SubDescChangeBody {
  name: string
  description: string
}

export interface JoinSubBody {
  userName: string
  subreddit: string
}

export { SubredditType } from '@/models/Subreddit'
