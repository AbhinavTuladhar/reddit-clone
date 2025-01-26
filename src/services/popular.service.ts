import axios from 'axios'

import { PopularSubreddits } from '@/types'

/**
 * For implementing infinite scrolling
 */
class PopularService {
  static async getPopularSubs() {
    try {
      const response = await axios.get<PopularSubreddits[]>('/api/popular')
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}
export default PopularService
