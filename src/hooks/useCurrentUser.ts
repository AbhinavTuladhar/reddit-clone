import { useSession } from 'next-auth/react'

const useCurrentUser = () => {
  const { data, status } = useSession()

  const userName = data?.user?.name || ''
  const email = data?.user?.email || ''

  return { userName, status, email }
}

export default useCurrentUser
