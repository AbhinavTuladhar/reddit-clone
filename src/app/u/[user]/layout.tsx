import React from 'react'
import ProfileNavigation from '@/components/ProfileNavigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ProfileNavigation />
      <div className='mx-0 md:mx-8 lg:mx-20'>
        {children}
      </div>
    </>
  )
}