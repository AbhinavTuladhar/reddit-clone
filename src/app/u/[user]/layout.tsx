import React from 'react'
import ProfileNavigation from '@/components/ProfileNavigation'
import UserProfileSideBar from '@/components/UserProfileSideBar'

interface LayoutProps {
  children: React.ReactNode,
  params: {
    user: string
  }
}

export default function RootLayout({ children, params }: LayoutProps) {
  const userName = params.user

  return (
    <>
      <ProfileNavigation />
      <div className='flex flex-row mx-0 mt-4 md:mx-8 lg:mx-20 gap-x-10'>
        {children}
        <section className='hidden w-80 lg:block'>
          <UserProfileSideBar userName={userName} />
        </section>
      </div>
    </>
  )
}