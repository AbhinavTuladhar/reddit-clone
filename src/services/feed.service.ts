import axios from 'axios'

/**
 * For implementing infinite scrolling
 */
class FeedService {
  static async getHomePosts(offset: number, limit: number) {
    // Make new url search params on the basis of offset and limit
    const params = new URLSearchParams()
    params.append('offset', offset.toString())
    params.append('limit', limit.toString())

    const url = `/api/home?${params.toString()}`
    try {
      const response = await axios.get<string[]>(url)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export default FeedService
