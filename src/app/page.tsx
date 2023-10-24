'use client'

import { useSession } from 'next-auth/react'
import CreatePostCard from '@/components/CreatePostCard'
import useSWR from 'swr'
import PostCard from '@/components/PostCard'
import HomeSidebar from '@/components/HomeSidebar'
import PopularCommunities from '@/components/PopularCommunities'

export default function Home() {
  const { status } = useSession()

  const fetcher = (url: string) => fetch(url).then((response) => response.json())
  const { data: postIdList } = useSWR<string[]>('/api/home?posts=10', fetcher)

  // This is for testing out the system environment variables in deployment
  const vercelUrl = process.env.VERCEL_URL
  const publicUrl = process.env.NEXT_PUBLIC_VERCEL_URL

  console.log({ vercelUrl, publicUrl })

  return (
    <div className='flex flex-row mt-4 gap-x-4'>
      <div className='flex flex-col flex-1'>
        {status === 'authenticated' && (
          <section className='mb-4'>
            <CreatePostCard />
          </section>
        )}
        <main className='flex flex-col gap-y-0'>
          {postIdList?.map((postId: string, index) => (
            <PostCard id={postId} subViewFlag={true} key={index} />
          ))}
        </main>
      </div>
      <section className='hidden w-80 lg:flex lg:flex-col lg:gap-y-4'>
        {status === 'authenticated' && <HomeSidebar />}
        <div className='sticky top-16'>
          <PopularCommunities />
        </div>
      </section>
    </div>
  )
}
