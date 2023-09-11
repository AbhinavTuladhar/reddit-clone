export type ModalStateType = 'closed' | 'login' | 'signup'

export interface ModalProps {
  modalState: ModalStateType,
  setModalState: (state: ModalStateType) => void
}

export interface SubredditType {
  name: string,
  description: string,
  rules?: string[],
  subscribers?: string[],
  createdAt: Date,
  creator: string,
  posts: string[]
}

export interface PostType {
  _id: string,
  author: string,
  subreddit: string,
  title: string,
  body?: string,
  createdAt: Date,
  upvotedBy: string[],
  downvotedBy: string[],
  comments: string[]
}