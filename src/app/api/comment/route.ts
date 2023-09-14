import { NextResponse, NextRequest } from "next/server"
import { connectDatabase } from "@/utils/db"
import Subreddit from "@/models/Subreddit"
import User from "@/models/User"
import Comment from "@/models/Comment"
import Post from "@/models/Post"
import { Document } from "mongodb"

interface RequestBody {
  content: string,
  author: string,
  post: string,
}

export const POST = async (request: NextRequest) => {
  const body: RequestBody = await request.json()

  const { author, content, post } = body

  try {
    await connectDatabase()

    const newComment = new Comment({ author, content, post })
    await newComment.save()

    // Update array in the Post schema.
    await Post.findOneAndUpdate(
      { _id: post },
      { $push: { comments: newComment._id } },
      { new: false }
    )

    // Update array in the User document.
    await User.findOneAndUpdate(
      { name: author },
      { $push: { comments: newComment._id } },
      { new: false }
    )

    return new NextResponse(JSON.stringify(body), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ message: 'error' }), { status: 501 })
  }
}