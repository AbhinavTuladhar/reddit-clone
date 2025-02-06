import axios from 'axios'

import {
  JoinSubBody,
  PopularSubreddits,
  SubCreationBody,
  SubDescChangeBody,
  SubredditListResponse,
  SubredditType,
} from '@/types'

// The posts are fetched from a different API endpoint, so posts are omitted from the response
type BasicSubreddit = Omit<SubredditType, 'posts'>

class SubredditService {
  static async getPopularSubs() {
    try {
      const response = await axios.get<PopularSubreddits[]>('/api/popular')
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
  static async getSubredditList() {
    try {
      const response = await axios.get<SubredditListResponse[]>('/api/r')
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getSubreddit(subredditName: string) {
    try {
      const response = await axios.get<BasicSubreddit>(`/api/r/${subredditName}`)
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

  static async changeSubredditDescription(requestBody: SubDescChangeBody) {
    try {
      const response = await axios.patch(`/api/r/${requestBody.name}`, requestBody)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default SubredditService
