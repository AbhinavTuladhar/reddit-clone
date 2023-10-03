import React from 'react'
import { UserOverviewResponse } from '@/types/types'
import CommentCard from '@/components/CommentCard'
import PostCard from '@/components/PostCard'

interface UserParams {
  params: {
    user: string
  }
}

const getUserContent = async (userName: string) => {
  const siteUrl = process.env.SITE_URL

  if (!siteUrl) {
    throw new Error('Site url in .env file has not been configured!')
  }

  try {
    const url = `${siteUrl}/api/u/${userName}/overview`
    const apiResponse = await fetch(url, { cache: 'force-cache' })
    const userData: UserOverviewResponse = await apiResponse.json()
    return userData
  } catch (error) {
    console.error('Error.')
  }
}

const page: React.FC<UserParams> = async ({ params }) => {
  const userName = params.user
  const userData = await getUserContent(userName)

  return (
    <>
      <span> {userName} </span>
      <div className='flex flex-col gap-y-2'>
        {userData?.overview.map((content, index) => {
          const { _id, type } = content
          const returningContent = type === 'comment' ? <CommentCard id={_id} showReply={false} /> : <PostCard id={_id} subViewFlag={true} />
          return (
            <section className={`${type === 'comment' && 'pl-2 pb-2'} bg-reddit-dark`} key={index}>
              {returningContent}
            </section>
          )
        })}
      </div>
    </>
  )
}

export default page