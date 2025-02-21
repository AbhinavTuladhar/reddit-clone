import React from 'react'

import ProfileNavigation from '@/components/ProfileNavigation'

import { UserSidebar } from './_components/'

interface LayoutProps {
  children: React.ReactNode
  params: {
    user: string
  }
}

export const generateMetadata = ({ params }: LayoutProps) => {
  return {
    title: `u/${params.user} - Reddit`,
  }
}

export default function RootLayout({ children, params }: LayoutProps) {
  const userName = params.user

  return (
    <>
      <ProfileNavigation />
      <div className="mx-0 mt-4 flex flex-col-reverse gap-x-10 gap-y-4 md:mx-8 lg:mx-20 lg:flex-row">
        {children}
        <section className="sticky top-16 w-full self-start lg:w-80">
          <UserSidebar userName={userName} />
        </section>
      </div>
    </>
  )
}
