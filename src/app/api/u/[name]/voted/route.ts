import { NextRequest, NextResponse } from 'next/server'

import Post from '@/models/Post'
import User from '@/models/User'
import { SimpleVoteStatus } from '@/types'
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
  const limit = request.nextUrl.searchParams.get('limit') || 100
  const voteType = (request.nextUrl.searchParams.get('type') as SimpleVoteStatus) || ('upvoted' as SimpleVoteStatus)

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

    if (voteType === 'upvoted') {
      const upvotedPosts = await Post.find({ _id: { $in: foundUser.upvotedPosts } }, { _id: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .skip(+offset)
        .limit(+limit)
      const upvotedPostIds = upvotedPosts.map((post) => post._id)
      return new NextResponse(JSON.stringify(upvotedPostIds, null, 2), { status: 201 })
    }

    const downvotedPosts = await Post.find({ _id: { $in: foundUser.downvotedPosts } }, { _id: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .skip(+offset)
      .limit(+limit)

    const downvotedPostIds = downvotedPosts.map((post) => post._id)

    return new NextResponse(JSON.stringify(downvotedPostIds, null, 2), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}
