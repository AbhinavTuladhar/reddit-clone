import { NextRequest, NextResponse } from "next/server"
import { connectDatabase } from "@/utils/db"
import Post from "@/models/Post"

export const GET = async (request: NextRequest) => {
  const postLimit = request.nextUrl.searchParams.get('posts') || 10

  try {
    await connectDatabase()

    const topPosts = await Post.find({}, { _id: 1 }).sort({ createdAt: -1 }).limit(Number(postLimit))

    const postIds = topPosts.map(post => post._id)

    return new NextResponse(JSON.stringify(postIds, null, 2), { status: 201 })

  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: error }), { status: 501 })
  }
}