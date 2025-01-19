'use client'

import React from 'react'

import CreatePostCard from '@/components/CreatePostCard'
import HomeSidebar from '@/components/HomeSidebar'
import useCurrentUser from '@/hooks/useCurrentUser'

import { PopularCommunities } from './_components'
import { HomeFeed } from './_components'

export default function Home() {
  const { status: userStatus } = useCurrentUser()

  return (
    <div className="mt-4 flex flex-col-reverse gap-4 lg:flex-row">
      <div className="flex flex-1 flex-col">
        <section className="mb-4">
          {userStatus === 'authenticated' ? (
            <CreatePostCard />
          ) : (
            <div className="grid h-[54px] place-items-center bg-reddit-dark"> Loading... </div>
          )}
        </section>
        <HomeFeed />
      </div>
      <section className="flex w-full flex-col gap-y-4 lg:w-80">
        {(userStatus === 'authenticated' || userStatus === 'loading') && (
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
