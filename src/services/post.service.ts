import axios from 'axios'

import { PostCreateBody, PostTypeNew, VotingRequestBodyWithId } from '@/types'

class PostService {
  static async getPost(postId: string, userName?: string) {
    try {
      const response = await axios.get<PostTypeNew>(`/api/post/${postId}?userName=${userName}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async createPost(body: PostCreateBody) {
    try {
      const response = await axios.post('/api/post', body)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async updatePostVoteCount(body: VotingRequestBodyWithId) {
    const { resourceId: postId, ...rest } = body

    try {
      const response = await axios.patch(`/api/post/${postId}`, rest)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default PostService
