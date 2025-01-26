import { NextRequest, NextResponse } from 'next/server'

import { PAGINATION_SIZE } from '@/constants'
import Post from '@/models/Post'
import User from '@/models/User'
import { connectDatabase } from '@/utils/db'

interface RequestParams {
  params: {
    name: string
  }
}

export const GET = async (request: NextRequest, params: RequestParams) => {
  const {
    params: { name },
  } = params
  const offset = request.nextUrl.searchParams.get('offset') || 0
  const limit = request.nextUrl.searchParams.get('limit') || PAGINATION_SIZE

  try {
    await connectDatabase()

    const foundUser = await User.findOne(
      { name },
      {
        name: 1,
        posts: 1,
        comments: 1,
        upvotedPosts: 1,
        downvotedPosts: 1,
      },
    )

    if (!foundUser) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 501 })
    }

    // Find all the posts and comments made by the user.
    const foundPosts = await Post.find({ _id: { $in: foundUser.posts } }, { _id: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .skip(+offset)
      .limit(+limit)
      .select({
        _id: 1,
        createdAt: 0,
      })

    const foundPostIds = foundPosts.map((post) => post._id)

    return new NextResponse(JSON.stringify(foundPostIds, null, 2), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}
