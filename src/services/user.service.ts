import axios from 'axios'

import { ContentId, SpecificContentId, UserBioChangeBody, UserType, VotedPosts } from '@/types'

type CommentDetails = Omit<SpecificContentId, 'type'>

class UserService {
  static async getUserData(userName: string) {
    try {
      const response = await axios.get<UserType>(`/api/u/${userName}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserOverview(userName: string, offset: number) {
    try {
      const response = await axios.get<SpecificContentId[]>(`/api/u/${userName}/overview?offset=${offset}&limit=10`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserComments(userName: string, offset: number) {
    try {
      const response = await axios.get<CommentDetails[]>(`/api/u/${userName}/comments?offset=${offset}&limit=10`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getVotedPosts(userName: string, offset: number) {
    try {
      const response = await axios.get<VotedPosts>(`/api/u/${userName}/voted?offset=${offset}&limit=10`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserPosts(userName: string, offset: number) {
    try {
      const response = await axios.get<ContentId[]>(`/api/u/${userName}/posts?offset=${offset}&limit=10`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async updateUserBio(body: UserBioChangeBody) {
    const { name: userName } = body

    try {
      const response = await axios.patch(`/api/u/${userName}/bioChange`, body)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default UserService
