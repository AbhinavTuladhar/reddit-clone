import { NextRequest, NextResponse } from "next/server"
import { connectDatabase } from "@/utils/db"
import Post from "@/models/Post"

export const POST = async (request: NextRequest) => {
  const requestBody = await request.json()

  const { author, subreddit, title, body = '' } = requestBody

  try {
    await connectDatabase()

    const newPost = new Post({ author, subreddit, title, body })
    await newPost.save()

    return new NextResponse(JSON.stringify(requestBody), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }

}