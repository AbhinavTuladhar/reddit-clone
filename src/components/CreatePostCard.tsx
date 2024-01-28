import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Profile from '../images/reddit_default_pp.png'

const CreatePostCard = () => {
  return (
    <section className="flex flex-1 flex-row items-center gap-x-4 bg-reddit-dark px-4 py-2">
      <Image src={Profile} alt="profile" className="h-9 w-9 rounded-full" />
      <Link href="/submit" className="w-full">
        <div className="flex w-full flex-1 border border-reddit-border bg-reddit-gray p-2 text-reddit-placeholder-gray duration-150 hover:cursor-text hover:border-white hover:bg-reddit-dark">
          Create post...
        </div>
      </Link>
    </section>
  )
}

export default CreatePostCard
