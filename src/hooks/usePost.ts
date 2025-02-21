import PostService from '@/services/post.service'
import { useQuery } from '@tanstack/react-query'

const usePost = (postId: string, userName?: string) =>
  useQuery({
    queryKey: ['post', postId, userName],
    queryFn: () => PostService.getPost(postId.toString(), userName),
  })

export default usePost
