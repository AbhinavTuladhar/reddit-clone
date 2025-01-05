class SubredditService {
  static async getSubreddits() {
    const response = await fetch('/api/r')
    return response.json()
  }
}

export default SubredditService
