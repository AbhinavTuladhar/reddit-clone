import { NextRequest, NextResponse } from 'next/server'

import Post from '@/models/Post'
import Subreddit from '@/models/Subreddit'
import { connectDatabase } from '@/utils/db'

interface RequestParams {
  params: {
    name: string
  }
}

/**
 * For getting just the post ids of the subreddit.
 */
export const GET = async (request: NextRequest, params: RequestParams) => {
  const {
    params: { name },
  } = params

  const offset = request.nextUrl.searchParams.get('offset') || 0
  const limit = request.nextUrl.searchParams.get('limit') || 100

  try {
    await connectDatabase()

    const foundSubreddit = await Subreddit.findOne({ name })

    if (!foundSubreddit) {
      return new NextResponse(JSON.stringify({ error: 'Subreddit not found' }), { status: 501 })
    }

    const subPosts = await Post.find({ subreddit: name }, { _id: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .skip(+offset)
      .limit(+limit)

    const posts = subPosts.map((post) => post._id)

    return new NextResponse(JSON.stringify(posts), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}
