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
      {children}
    </>
  )
}