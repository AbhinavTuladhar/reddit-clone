export interface SubredditListResponse {
  _id: string
  name: string
  creator: string
}

export interface SubCreationBody {
  email: string
  subredditName: string
}

export interface SubDescChangeBody {
  name: string
  description: string
}

export interface JoinSubBody {
  userName: string
  subreddit: string
}

export { SubredditType } from '@/models/Subreddit'
