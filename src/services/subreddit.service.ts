import axios from 'axios'

import { JoinSubBody, SubCreationBody, SubDescChangeBody, SubredditListResponse, SubredditType } from '@/types'

class SubredditService {
  static async getSubreddits() {
    try {
      const response = await axios.get<SubredditListResponse[]>('/api/r')
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getSubreddit(subredditName: string) {
    try {
      const response = await axios.get<SubredditType>(`/api/r/${subredditName}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async createSubreddit(requestBody: SubCreationBody) {
    try {
      const response = await axios.post('/api/r', requestBody)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async joinSubreddit(requestBody: JoinSubBody) {
    try {
      const response = await axios.patch('/api/r/join', requestBody)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async changeSubredditDescription(subredditName: string, requestBody: SubDescChangeBody) {
    try {
      const response = await axios.patch(`/api/r/${subredditName}`, requestBody)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default SubredditService
