import { NextRequest, NextResponse } from 'next/server'

import Post from '@/models/Post'
import Subreddit from '@/models/Subreddit'
import User from '@/models/User'
import { connectDatabase } from '@/utils/db'

export const POST = async (request: NextRequest) => {
  const requestBody = await request.json()

  const { author, subreddit, title, body = '' } = requestBody

  try {
    await connectDatabase()

    const newPost = new Post({ author, subreddit, title, body })
    await newPost.save()

    // Update posts in the subreddit
    await Subreddit.findOneAndUpdate({ name: subreddit }, { $push: { posts: newPost._id } }, { new: true })

    // Update posts in the user profile
    await User.findOneAndUpdate({ name: author }, { $push: { posts: newPost._id } })

    return new NextResponse(JSON.stringify(requestBody), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }
}
