import UserService from '@/services/user.service'
import { useQuery } from '@tanstack/react-query'

const useUser = (userName: string) =>
  useQuery({
    queryKey: ['user', userName],
    queryFn: () => UserService.getUserData(userName),
  })

export default useUser
