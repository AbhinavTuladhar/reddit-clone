'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Profile from '../images/reddit_default_pp.png'
import { CommentType as CommentProps } from '@/types/types'
import axios from 'axios'

const CommentCard: React.FC<CommentProps> = ({
  _id,
  content,
  author,
  post,
  parentComment,
  createdAt,
  replies,
  upvotedBy,
  downvotedBy,
  comments,
}) => {

  return (
    <main className='flex flex-row gap-x-4'>
      <Image
        src={Profile}
        alt='profile pic'
        className='rounded-full h-8 w-8'
      />
      <section className='flex flex-col gap-y-1'>
        <Link href={`/u/${author}`} className='text-sm hover:underline tracking-tight'> {author} </Link>
        <div>
          {content}
        </div>
      </section>
    </main>
  )
}

export default CommentCard
