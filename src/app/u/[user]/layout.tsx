import React from 'react'
import type { Metadata } from 'next'
import ProfileNavigation from '@/components/ProfileNavigation'
import UserProfileSideBar from '@/components/UserProfileSideBar'

interface LayoutProps {
  children: React.ReactNode,
  params: {
    user: string
  }
}

export const generateMetadata = ({ params }: LayoutProps) => {
  return {
    title: `u/${params.user} - Reddit`
  }
}

export default function RootLayout({ children, params }: LayoutProps) {
  const userName = params.user

  return (
    <>
      <ProfileNavigation />
      <div className='flex flex-col-reverse lg:flex-row mx-0 mt-4 md:mx-8 lg:mx-20 gap-x-10 gap-y-4'>
        {children}
        <section className='w-full lg:w-80'>
          <UserProfileSideBar userName={userName} />
        </section>
      </div>
    </>
  )
}