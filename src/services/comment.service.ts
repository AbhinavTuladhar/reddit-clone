import axios from 'axios'

import {
  CommentCreationBody,
  CommentEditBodyWithId,
  CommentType,
  CommentTypeNew,
  VotingRequestBodyWithId,
} from '@/types'

class CommentService {
  static async getComment(commentId: string, userName?: string) {
    try {
      const response = await axios.get<CommentTypeNew>(`/api/comment/${commentId}?userName=${userName}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getComments(postId: string) {
    try {
      const response = await axios.get<CommentType>(`/api/post/${postId}/comments`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async createComment(body: CommentCreationBody) {
    try {
      const response = await axios.post('/api/comment', body)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async editComment(body: CommentEditBodyWithId) {
    const { commentId, ...rest } = body

    try {
      const response = await axios.patch(`/api/comment/${commentId}/edit`, rest)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async updateCommentVoteCount(body: VotingRequestBodyWithId) {
    const { resourceId: commentId, ...rest } = body
    try {
      const response = await axios.patch(`/api/comment/${commentId}`, rest)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default CommentService
