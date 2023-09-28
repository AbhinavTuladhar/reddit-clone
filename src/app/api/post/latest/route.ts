import { NextRequest, NextResponse } from "next/server"
import { connectDatabase } from "@/utils/db"
import Post from "@/models/Post"

export const GET = async (_request: NextRequest) => {
  try {
    await connectDatabase()

    const topPosts = await Post.find({}, { _id: 1 }).sort({ createdAt: -1 }).limit(10)

    const postIds = topPosts.map(post => post._id)

    return new NextResponse(JSON.stringify(postIds, null, 2), { status: 201 })

  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: error }), { status: 501 })
  }
}