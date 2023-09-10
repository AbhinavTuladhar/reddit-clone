'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Profile from '../images/reddit_default_pp.png'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { status } = useSession()

  return (
    <main className='mt-4 flex flex-col gap-y-4'>
      {status === 'authenticated' && (
        <section className='bg-reddit-dark p-4 flex flex-row flex-1 items-center gap-x-4 h-12'>
          <Image src={Profile} alt='profile' className='h-9 w-9 rounded-full' />
          <Link href='/submit' className='w-full'>
            <div className='bg-reddit-gray text-reddit-placeholder-gray border border-reddit-border p-2 hover:cursor-text flex flex-1 w-full hover:bg-reddit-dark hover:border-white'>
              Create post...
            </div>
          </Link>
        </section>
      )}
      <p> Reddit uWu</p>
      <div className='w-1/12'>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa laboriosam reiciendis corporis iste blanditiis ea similique consectetur quam velit vitae doloribus ullam, id tempore nobis aliquam! Rem veritatis hic ratione. <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde a architecto asperiores aliquam, corporis eaque officia non itaque facere error consectetur excepturi voluptas minus quis? Quisquam odio ipsa nihil optio? <br />
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore, odio corporis cupiditate tempora, ducimus corrupti quas officiis deleniti distinctio accusantium animi laudantium commodi. Necessitatibus modi earum eligendi iure laboriosam culpa!
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio nulla saepe animi labore fuga culpa iste sunt aut. Provident consequuntur consectetur enim suscipit commodi blanditiis voluptatibus et cum dolorem pariatur! <br />
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla maxime obcaecati, id laborum quo impedit accusamus, harum possimus aspernatur ex esse culpa. Architecto eligendi nulla ratione asperiores quas, maiores et. <br />
      </div>
    </main>
  )
}
