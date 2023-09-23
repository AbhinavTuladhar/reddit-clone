import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Profile from '../images/reddit_default_pp.png'

const CreatePostCard = () => {
  return (
    <section className='flex flex-row items-center flex-1 h-12 p-4 bg-reddit-dark gap-x-4'>
      <Image src={Profile} alt='profile' className='rounded-full h-9 w-9' />
      <Link href='/submit' className='w-full'>
        <div className='flex flex-1 w-full p-2 border bg-reddit-gray text-reddit-placeholder-gray border-reddit-border hover:cursor-text hover:bg-reddit-dark hover:border-white'>
          Create post...
        </div>
      </Link>
    </section>
  )
}

export default CreatePostCard