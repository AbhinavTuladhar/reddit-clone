import React from 'react'
import Link from 'next/link'
import { UserOverviewResponse } from '@/types/types'
import CommentCard from '@/components/CommentCard'
import PostCard from '@/components/PostCard'
import { FaRegCommentAlt } from 'react-icons/fa'
import UserProfileSideBar from '@/components/UserProfileSideBar'

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
    <Link href={`/r/${postSubreddit}/comments/${postId}`} className='flex flex-row flex-wrap items-center p-2 -mb-2 text-xs border border-reddit-border gap-x-1 bg-reddit-dark hover:border-white hover:cursor-pointer'>
      <FaRegCommentAlt className='w-4 h-4 mr-2 text-reddit-placeholder-gray' />
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
    <div className='flex flex-row mt-4 gap-x-10'>
      <main className='flex flex-col flex-1 gap-y-2'>
        {userData?.overview.map((content, index) => {
          const { _id, type, postAuthor, postSubreddit = '', postTitle = '', postId = '' } = content

          if (type === 'post') {
            return <PostCard id={_id} subViewFlag={true} key={index} />
          }

          return (
            <>
              <CommentHeader postAuthor={postAuthor} postSubreddit={postSubreddit} postTitle={postTitle} postId={postId} userName={userName} />
              <section className={`${type === 'comment' && 'pl-2 pb-2'} bg-reddit-dark border border-transparent hover:border-white hover:cursor-pointer`} key={index}>
                <Link href={`/r/${postSubreddit}/comments/${postId}`}>
                  <CommentCard id={_id} showReply={false} />
                </Link>
              </section>
            </>
          )
        })}
      </main>

      <section className='hidden w-80 lg:block'>
        <UserProfileSideBar userName={userName} />
      </section>
    </div>
  )
}

export default page