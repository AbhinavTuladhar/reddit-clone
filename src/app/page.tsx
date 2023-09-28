'use client'

import { useSession } from 'next-auth/react'
import CreatePostCard from '@/components/CreatePostCard'
import useSWR from 'swr'
import PostCard from '@/components/PostCard'

export default function Home() {
  const { status } = useSession()

  const fetcher = (url: string) => fetch(url).then((response) => response.json())
  const { data: postIdList } = useSWR<string[]>('/api/post/latest', fetcher)

  return (
    <main className='flex flex-col mt-4 gap-y-4'>
      {status === 'authenticated' && <CreatePostCard />}
      {postIdList?.map((postId: string) => (
        <PostCard id={postId} subViewFlag={true} />
      ))}
    </main>
  )
}
