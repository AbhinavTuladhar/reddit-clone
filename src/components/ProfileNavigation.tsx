'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ProfileNavigation = () => {
  const currentPath = usePathname()

  // Extract the userName
  const urlParts = currentPath.split('/')
  const userNameIndex = urlParts.indexOf('u')
  const userName = urlParts[userNameIndex + 1]

  // Check which part of the profile we are in
  const finalUrlPart = urlParts[urlParts.length - 1]

  const navElements = [
    { text: 'OVERVIEW', href: `/u/${userName}`, condition: !['posts', 'comments'].includes(finalUrlPart) },
    { text: 'POSTS', href: `/u/${userName}/posts`, condition: finalUrlPart === 'posts' },
    { text: 'COMMENTS', href: `/u/${userName}/comments`, condition: finalUrlPart === 'comments' }
  ]

  return (
    <div className='flex flex-row w-[98.5dvw] pl-4 md:pl-12 lg:pl-24 -ml-4 text-xl bg-reddit-dark gap-x-2'>
      {navElements.map((row, index) => (
        <div className={`px-2 py-2 text-sm tracking-tighter text-center text-white border-b-2 border-transparent ${row.condition && 'border-white'} `} key={index}>
          <Link href={row.href}> {row.text} </Link>
        </div>
      ))}
    </div>
  )
}

export default ProfileNavigation