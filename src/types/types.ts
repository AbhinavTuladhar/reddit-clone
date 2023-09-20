export type ModalStateType = 'closed' | 'login' | 'signup'

export type voteStatus = 'upvoted' | 'nonvoted' | 'downvoted'

export interface ModalProps {
  modalState: ModalStateType,
  setModalState: (state: ModalStateType) => void
}

export interface SubredditType {
  name: string,
  description: string,
  rules?: string[],
  subscribers?: string[],
  createdAt: string,
  creator: string,
  posts: string[]
}

export interface PostType {
  _id: string,
  author: string,
  subreddit: string,
  title: string,
  body?: string,
  createdAt: string,
  upvotedBy: string[],
  downvotedBy: string[],
  comments: string[],
  topLevelComments?: string[]
}

export interface CommentType {
  _id: string,
  content: string,
  author: string,
  post: string,
  parentComment: string | null,
  createdAt: string,
  replies: string[],
  upvotedBy: string[],
  downvotedBy: string[],
  comments: string[]
}

export interface VotingRequestBody {
  user: string,
  voteTarget: voteStatus
}