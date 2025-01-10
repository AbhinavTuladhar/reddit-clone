import axios from 'axios'

import { ContentId, SpecificContentId, UserBioChangeBody, UserType, VotedPosts } from '@/types'

type CommentDetails = Omit<SpecificContentId, 'type'>

class UserService {
  static async getUserData(userName: string) {
    try {
      const response = await axios.get<UserType>(`api/user/${userName}/overview?offset=0&limit=10`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserOverview(userName: string, offset: number) {
    try {
      const response = await axios.get<SpecificContentId[]>(`/api/user/${userName}/overview?offset=${offset}&limit=10`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserComments(userName: string, offset: number) {
    try {
      const response = await axios.get<CommentDetails[]>(`/api/user/${userName}/comments?offset=${offset}&limit=10`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getVotedPosts(userName: string, offset: number) {
    try {
      const response = await axios.get<VotedPosts>(`/api/user/${userName}/voted?offset=${offset}&limit=10`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserPosts(userName: string, offset: number) {
    try {
      const response = await axios.get<ContentId[]>(`/api/user/${userName}/posts?offset=${offset}&limit=10`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async updateUserBio(userName: string, body: UserBioChangeBody) {
    try {
      const response = await axios.patch(`/api/user/${userName}/bioChange`, body)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default UserService
