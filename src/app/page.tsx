'use client'

import React from 'react'

import CreatePostCard from '@/components/CreatePostCard'
import HomeSidebar from '@/components/HomeSidebar'
import PopularCommunities from '@/components/PopularCommunities'
import useCurrentUser from '@/hooks/useCurrentUser'

import { HomeFeed } from './_components'

export default function Home() {
  const { status: userStatus } = useCurrentUser()

  return (
    <div className="mt-4 flex flex-col-reverse gap-4 lg:flex-row">
      <div className="flex flex-1 flex-col">
        {userStatus === 'authenticated' && (
          <section className="mb-4">
            <CreatePostCard />
          </section>
        )}
        <HomeFeed />
      </div>
      <section className="flex w-full flex-col gap-y-4 lg:w-80">
        {userStatus === 'authenticated' && (
          <div className="hidden lg:block">
            <HomeSidebar />
          </div>
        )}
        <div className="sticky top-16">
          <PopularCommunities />
        </div>
      </section>
    </div>
  )
}
