import React from 'react'
import Link from 'next/link'
import { UserOverviewResponse } from '@/types/types'
import CommentCard from '@/components/CommentCard'
import PostCard from '@/components/PostCard'

interface UserParams {
  params: {
    user: string
  }
}

interface CommentHeaderProps {
  postAuthor: string | undefined,
  postSubreddit: string | undefined,
  postTitle: string | undefined,
  postId: string | undefined,
  userName: string | undefined
}

const CommentHeader: React.FC<CommentHeaderProps> = ({ postAuthor, postSubreddit, postTitle, postId, userName }) => {
  return (
    <Link href={`/r/${postSubreddit}/post/${postId}`} className='flex flex-row p-2 -mb-2 border border-reddit-border gap-x-1 bg-reddit-dark hover:border-white hover:cursor-pointer'>
      <span> {userName} </span>
      <span className='text-reddit-placeholder-gray'> commented on </span>
      <span className='text-white'> {`${postTitle}`} </span>
      <span> • </span>
      <Link className='font-bold text-white hover:underline' href={`/r/${postSubreddit}`}>{`/r/${postSubreddit}`}</Link>
      <span className='text-reddit-placeholder-gray'>
        Posted by
        <Link className='hover:underline' href={`/u/${postAuthor}`}> {`u/${postAuthor}`} </Link>
      </span>
    </Link>
  )
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
          const { _id, type, postAuthor, postSubreddit = '', postTitle = '', postId = '' } = content

          if (type === 'post') {
            return <PostCard id={_id} subViewFlag={true} key={index} />
          }

          return (
            <>
              <CommentHeader postAuthor={postAuthor} postSubreddit={postSubreddit} postTitle={postTitle} postId={postId} userName={userName} />
              <section className={`${type === 'comment' && 'pl-2 pb-2'} bg-reddit-dark border border-transparent hover:border-white hover:cursor-pointer`} key={index}>
                <CommentCard id={_id} showReply={false} />
              </section>
            </>
          )
        })}
      </div>
    </>
  )
}

export default page