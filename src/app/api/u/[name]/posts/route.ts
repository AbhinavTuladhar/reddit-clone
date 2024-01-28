import { NextRequest, NextResponse } from 'next/server'
import { connectDatabase } from '@/utils/db'
import User from '@/models/User'
import Post from '@/models/Post'

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
  const limit = request.nextUrl.searchParams.get('limit') || 100

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

    return new NextResponse(JSON.stringify(foundPosts, null, 2), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}
