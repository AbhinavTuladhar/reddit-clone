import React from 'react'
import { UserOverviewResponse } from '@/types/types'
import PostCard from '@/components/PostCard'

interface UserParams {
  params: {
    user: string
  }
}

const getUserPosts = async (userName: string) => {
  const siteUrl = process.env.SITE_URL

  if (!siteUrl) {
    throw new Error('Site url in .env file has not been configured!')
  }

  try {
    const url = `${siteUrl}/api/u/${userName}/overview`
    const apiResponse = await fetch(url, { cache: 'force-cache' })
    const userData: UserOverviewResponse = await apiResponse.json()
    return userData.posts
  } catch (error) {
    console.error('Error.')
  }
}

const page: React.FC<UserParams> = async ({ params }) => {
  const userName = params.user
  const userPosts = await getUserPosts(userName)

  return (
    <main className='flex flex-col flex-1 gap-y-2'>
      {userPosts?.map((post, index) => (
        <PostCard id={post._id} subViewFlag={true} key={index} />
      ))}
    </main>
  )
}

export default page