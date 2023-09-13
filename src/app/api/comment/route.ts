import { NextResponse, NextRequest } from "next/server"
import { connectDatabase } from "@/utils/db"
import Subreddit from "@/models/Subreddit"
import User from "@/models/User"
import Comment from "@/models/Comment"
import { Document } from "mongodb"

interface RequestBody {
  content: string,
  author: string,
  post: string,
}

export const POST = async (request: NextRequest) => {
  const body: RequestBody = await request.json()

  const { author, content, post } = body

  const newComment = new Comment({ author, content, post })


  try {
    await connectDatabase()

    await newComment.save()

    return new NextResponse(JSON.stringify(body), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ message: 'error' }), { status: 501 })
  }
}