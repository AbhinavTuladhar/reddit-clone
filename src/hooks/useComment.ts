import CommentService from '@/services/comment.service'
import { useQuery } from '@tanstack/react-query'

const useComment = (commentId: string, userName?: string) =>
  useQuery({
    queryKey: ['comment', commentId, userName],
    queryFn: () => CommentService.getComment(commentId.toString(), userName),
  })

export default useComment
