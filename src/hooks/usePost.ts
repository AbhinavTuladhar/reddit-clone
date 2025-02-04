import PostService from '@/services/post.service'
import { useQuery } from '@tanstack/react-query'

const usePost = (postId: string) =>
  useQuery({
    queryKey: ['post', postId],
    queryFn: () => PostService.getPost(postId.toString()),
  })

export default usePost
