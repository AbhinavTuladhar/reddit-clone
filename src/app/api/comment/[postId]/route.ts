// This is for fetching all the comments in a post with id of [postId]

import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/utils/db";
import Subreddit from "@/models/Subreddit";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

interface RequestParams {
  params: {
    postId: string
  }
}

export const GET = async (_request: NextRequest, params: RequestParams) => {
  const { params: { postId: postId } } = params

  try {
    await connectDatabase()

    const foundComments = await Comment.find({ post: postId })

    return new NextResponse(JSON.stringify(foundComments), { status: 200 })
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error }), { status: 500 })
  }
}