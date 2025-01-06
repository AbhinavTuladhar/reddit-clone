import axios from 'axios'

import { CommentCreationBody, CommentEditBody, CommentType } from '@/types'

class CommentService {
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

  static async editComment(commentId: string, body: CommentEditBody) {
    try {
      const response = await axios.patch(`/api/comment/${commentId}/edit`, body)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default CommentService
