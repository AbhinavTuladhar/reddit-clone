import { NextRequest, NextResponse } from 'next/server'

import Comment from '@/models/Comment'
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

    const foundComments = await Comment.find({ _id: { $in: foundUser.comments } }, { _id: 1, createdAt: 1, post: 1 })
      .sort({ createdAt: -1 })
      .skip(+offset)
      .limit(+limit)

    const postIdsOfCommentedPosts = foundComments.map((comment) => comment.post)

    const postsCommentedIn = await Post.find(
      { _id: { $in: postIdsOfCommentedPosts } },
      { author: 1, subreddit: 1, title: 1, _id: 1 },
    )

    // This array of objects contains the comment id, and some details of the post.
    const properComments = foundComments.map((comment) => {
      const obj1 = comment.toObject()
      const matchingObj = postsCommentedIn.find((post) => {
        const obj = post.toObject()
        return obj1.post.toString() === obj._id.toString()
      })

      if (!matchingObj) return {}

      return {
        type: 'comment',
        postId: matchingObj._id,
        _id: obj1._id,
        createdAt: obj1.createdAt,
      }
    })

    return new NextResponse(JSON.stringify(properComments, null, 2), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}
