import SubredditService from '@/services/subreddit.service'
import { useQuery } from '@tanstack/react-query'

const useSubreddit = (subName: string) =>
  useQuery({
    queryKey: ['subreddit', subName],
    queryFn: () => SubredditService.getSubreddit(subName),
  })

export default useSubreddit
