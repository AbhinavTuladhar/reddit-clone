export type ModalStateType = 'closed' | 'login' | 'signup'

export type voteStatus = 'upvoted' | 'nonvoted' | 'downvoted'

export interface ModalProps {
  modalState: ModalStateType,
  setModalState: (state: ModalStateType) => void
}

export interface UserType {
  name: string,
  email: string,
  password: string,
  createdAt: string,
  bio: string,
  postKarma: number,
  commentKarma: number,
  subscribedSubs: string[],
  posts: string[],
  comments: string[],
  upvotedPosts: string[],
  downvotedPosts: string[],
  upvotedComments: string[],
  downvotedComments: string[]
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
  comments: string[],
  editedFlag: boolean,
  editedAt: string
}

export interface VotingRequestBody {
  user: string,
  author: string
  voteTarget: voteStatus
}

export interface SubDescChangeBody {
  name: string,
  description: string
}

export interface UserBioChangeBody {
  name: string,
  bio: string
}

export interface JoinSubBody {
  userName: string,
  subreddit: string
}

export interface ContentId {
  _id: string,
  createdAt: string,
}

export interface SpecificContentId extends ContentId {
  type: 'post' | 'comment',
  postAuthor?: string
  postSubreddit?: string
  postTitle?: string
  postId?: string
}

export interface UserOverviewResponse {
  posts: ContentId[],
  comments: ContentId[],
  overview: SpecificContentId[]
}

export interface CommentEditBody {
  userName: string,
  content: string
}