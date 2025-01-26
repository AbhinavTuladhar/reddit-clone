import axios from 'axios'
import { Types } from 'mongoose'

import { PAGINATION_SIZE } from '@/constants'
import { ContentWithType, SimpleVoteStatus, UserComment } from '@/types'

/**
 * For implementing infinite scrolling
 */
class FeedService {
  static async getHomePosts({ pageParam }: { pageParam: number }) {
    // Make new url search params on the basis of offset and limit
    const params = new URLSearchParams()
    params.append('offset', pageParam.toString())
    params.append('limit', PAGINATION_SIZE.toString())

    const url = `/api/home?${params.toString()}`
    try {
      const response = await axios.get<Types.ObjectId[]>(url)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getSubredditPosts({ name, pageParam }: { name: string; pageParam: number }) {
    const params = new URLSearchParams()
    params.append('offset', pageParam.toString())
    params.append('limit', PAGINATION_SIZE.toString())

    const url = `/api/r/${name}/posts?${params.toString()}`
    try {
      const response = await axios.get<Types.ObjectId[]>(url)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserOverview({ userName, pageParam }: { userName: string; pageParam: number }) {
    const params = new URLSearchParams()
    params.append('offset', pageParam.toString())
    params.append('limit', PAGINATION_SIZE.toString())

    const url = `/api/u/${userName}/overview?${params.toString()}`
    try {
      const response = await axios.get<ContentWithType[]>(url)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserPosts({ userName, pageParam }: { userName: string; pageParam: number }) {
    const params = new URLSearchParams()
    params.append('offset', pageParam.toString())
    params.append('limit', PAGINATION_SIZE.toString())

    const url = `/api/u/${userName}/posts?${params.toString()}`
    try {
      const response = await axios.get<Types.ObjectId[]>(url)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserComments({ userName, pageParam }: { userName: string; pageParam: number }) {
    const params = new URLSearchParams()
    params.append('offset', pageParam.toString())
    params.append('limit', PAGINATION_SIZE.toString())

    const url = `/api/u/${userName}/comments?${params.toString()}`
    try {
      const response = await axios.get<UserComment[]>(url)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  static async getUserVotedPosts({
    userName,
    pageParam,
    voteType,
  }: {
    userName: string
    pageParam: number
    voteType: SimpleVoteStatus
  }) {
    const params = new URLSearchParams()
    params.append('offset', pageParam.toString())
    params.append('limit', PAGINATION_SIZE.toString())
    params.append('type', voteType)

    const url = `/api/u/${userName}/voted?${params.toString()}`
    try {
      const response = await axios.get<Types.ObjectId[]>(url)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default FeedService
