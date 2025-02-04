import CommentService from '@/services/comment.service'
import { useQuery } from '@tanstack/react-query'

const useComment = (commentId: string) =>
  useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => CommentService.getComment(commentId.toString()),
  })

export default useComment
