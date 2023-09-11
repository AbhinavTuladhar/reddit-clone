import { NextRequest, NextResponse } from "next/server"
import { connectDatabase } from "@/utils/db"
import Post from "@/models/Post"
import Subreddit from "@/models/Subreddit"
import User from "@/models/User"

interface RequestParams {
  params: {
    id: string
  }
}

export const GET = async (request: NextRequest, params: RequestParams) => {
  const { params: { id } } = params

  try {
    await connectDatabase()

    const foundPost = await Post.findOne({ _id: id })

    return new NextResponse(JSON.stringify(foundPost), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }

}