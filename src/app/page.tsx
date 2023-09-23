'use client'

import { useSession } from 'next-auth/react'
import CreatePostCard from '@/components/CreatePostCard'

export default function Home() {
  const { status } = useSession()

  return (
    <main className='flex flex-col mt-4 gap-y-4'>
      {status === 'authenticated' && <CreatePostCard />}
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
