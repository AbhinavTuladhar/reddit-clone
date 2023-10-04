import React from 'react'
import Link from 'next/link'
import CommentHeader from '@/components/CommentHeader'
import CommentCard from '@/components/CommentCard'
import { UserOverviewResponse } from '@/types/types'

interface UserParams {
  params: {
    user: string
  }
}

const getUserComments = async (userName: string) => {
  const siteUrl = process.env.SITE_URL

  if (!siteUrl) {
    throw new Error('Site url in .env file has not been configured!')
  }

  try {
    const url = `${siteUrl}/api/u/${userName}/overview`
    const apiResponse = await fetch(url, { cache: 'force-cache' })
    const userData: UserOverviewResponse = await apiResponse.json()
    return userData.overview.filter(content => content.type === 'comment')
  } catch (error) {
    console.error('Error.')
  }
}

const page: React.FC<UserParams> = async ({ params }) => {
  const userName = params.user
  const userComments = await getUserComments(userName)

  return (
    <main className='flex flex-col flex-1 gap-y-2'>
      {userComments?.map((comment, index) => {
        const { _id, postAuthor, postId, postSubreddit, postTitle } = comment
        return (
          <div key={index} className='duration-300 border border-transparent hover:border-white'>
            <CommentHeader postAuthor={postAuthor} postSubreddit={postSubreddit} postTitle={postTitle} postId={postId} userName={userName} />
            <section className='pb-2 pl-2 duration-300 border border-transparent bg-reddit-dark hover:border-white hover:cursor-pointer' key={index}>
              <Link href={`/r/${postSubreddit}/comments/${postId}`}>
                <CommentCard id={_id} showReply={false} />
              </Link>
            </section>
          </div>
        )
      })}
    </main>
  )
}

export default page