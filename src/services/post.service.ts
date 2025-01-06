import axios from 'axios'

import { PostCreateBody, PostType } from '@/types'

class PostService {
  static async getPost(postId: string) {
    try {
      const response = await axios.get<PostType>(`/api/post/${postId}`)
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
}

export default PostService
