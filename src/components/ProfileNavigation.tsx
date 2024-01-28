'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface NavElementProps {
  text: string
  href: string
  condition: boolean
}

const NavElement: React.FC<NavElementProps> = ({ text, href, condition }) => {
  return (
    <div
      className={`border-b-2 border-transparent px-2 py-2 text-center text-sm tracking-tighter text-white ${condition && 'border-white'} `}
    >
      <Link href={href}> {text} </Link>
    </div>
  )
}

const ProfileNavigation = () => {
  const currentPath = usePathname()
  const session = useSession()
  const currentUser = session.data?.user?.name

  // Extract the userName
  const urlParts = currentPath.split('/')
  const userNameIndex = urlParts.indexOf('u')
  const userName = urlParts[userNameIndex + 1]

  // Check which part of the profile we are in
  const finalUrlPart = urlParts[urlParts.length - 1]

  const navElements = [
    {
      text: 'OVERVIEW',
      href: `/u/${userName}`,
      condition: !['posts', 'comments', 'upvoted', 'downvoted'].includes(finalUrlPart),
    },
    { text: 'POSTS', href: `/u/${userName}/posts`, condition: finalUrlPart === 'posts' },
    { text: 'COMMENTS', href: `/u/${userName}/comments`, condition: finalUrlPart === 'comments' },
    { text: 'UPVOTED', href: `/u/${userName}/upvoted`, condition: finalUrlPart === 'upvoted' },
    { text: 'DOWNVOTED', href: `/u/${userName}/downvoted`, condition: finalUrlPart === 'downvoted' },
  ]

  return (
    <div className="md:-pr-4 -ml-4 -mr-4 flex w-[105vw] flex-row gap-x-2 overflow-x-auto bg-reddit-dark pl-4 text-xl md:mr-0 md:pl-12 lg:pl-24">
      {currentUser === userName ? (
        <>
          {navElements.map((row, index) => (
            <NavElement condition={row.condition} href={row.href} text={row.text} key={index} />
          ))}
        </>
      ) : (
        <>
          {navElements.slice(0, 3).map((row, index) => (
            <NavElement condition={row.condition} href={row.href} text={row.text} key={index} />
          ))}
        </>
      )}
    </div>
  )
}

export default ProfileNavigation
