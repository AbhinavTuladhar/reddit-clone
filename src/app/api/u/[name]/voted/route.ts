import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/utils/db";
import User from "@/models/User";
import Post from "@/models/Post";

interface RequestParams {
  params: {
    name: string
  }
}

export const GET = async (request: NextRequest, params: RequestParams) => {
  const { params: { name } } = params
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
        downvotedPosts: 1
      }
    )

    const upvotedPosts = await Post.find(
      { _id: { $in: foundUser.upvotedPosts } },
      { _id: 1, createdAt: 1 }
    ).sort({ createdAt: -1 }).skip(+offset).limit(+limit)

    const downvotedPosts = await Post.find(
      { _id: { $in: foundUser.downvotedPosts } },
      { _id: 1, createdAt: 1 }
    ).sort({ createdAt: -1 }).skip(+offset).limit(+limit)

    const upvotedPostIds = upvotedPosts.map((post: any) => post._id)
    const downvotedPostIds = downvotedPosts.map((post: any) => post._id)

    const votedResponse = {
      upvotedIds: upvotedPostIds,
      downvotedIds: downvotedPostIds
    }

    return new NextResponse(JSON.stringify(votedResponse, null, 2), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}