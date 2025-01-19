import axios from 'axios'
import { Types } from 'mongoose'

/**
 * For implementing infinite scrolling
 */
class FeedService {
  static async getHomePosts({ pageParam }: { pageParam: number }) {
    // Make new url search params on the basis of offset and limit
    const params = new URLSearchParams()
    params.append('offset', pageParam.toString())
    params.append('limit', '10')

    const url = `/api/home?${params.toString()}`
    try {
      const response = await axios.get<Types.ObjectId[]>(url)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default FeedService
