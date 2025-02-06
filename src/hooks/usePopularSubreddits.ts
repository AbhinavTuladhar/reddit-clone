import SubredditService from '@/services/subreddit.service'
import { useQuery } from '@tanstack/react-query'

const usePopularSubreddits = () =>
  useQuery({
    queryKey: ['popular-subreddits'],
    queryFn: () => SubredditService.getPopularSubs(),
  })

export default usePopularSubreddits
