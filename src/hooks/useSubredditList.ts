import SubredditService from '@/services/subreddit.service'
import { useQuery } from '@tanstack/react-query'

const useSubredditList = () =>
  useQuery({
    queryKey: ['subreddit-list'],
    queryFn: () => SubredditService.getSubredditList(),
  })

export default useSubredditList
