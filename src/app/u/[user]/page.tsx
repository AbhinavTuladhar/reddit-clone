import React from 'react'
import Link from 'next/link'
import { UserOverviewResponse } from '@/types/types'
import CommentCard from '@/components/CommentCard'
import PostCard from '@/components/PostCard'
import CommentHeader from '@/components/CommentHeader'

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

const Page: React.FC<UserParams> = async ({ params }) => {
  const userName = params.user
  const userData = await getUserContent(userName)

  return (
    <main className='flex flex-col flex-1 gap-y-2'>
      {userData?.overview.map((content, index) => {
        const { _id, type, postAuthor, postSubreddit = '', postTitle = '', postId = '' } = content

        if (type === 'post') {
          return <PostCard id={_id} subViewFlag={true} key={index} />
        }

        return (
          <div key={index} className='duration-300 border border-transparent hover:border-white'>
            <CommentHeader postAuthor={postAuthor} postSubreddit={postSubreddit} postTitle={postTitle} postId={postId} userName={userName} />
            <section className={`${type === 'comment' && 'pl-2 pb-2'} bg-reddit-dark border border-transparent hover:border-white hover:cursor-pointer duration-300`} key={index}>
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

export default Page