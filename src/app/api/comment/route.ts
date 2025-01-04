import { NextRequest, NextResponse } from 'next/server'

import Comment from '@/models/Comment'
import Post from '@/models/Post'
import User from '@/models/User'
import { connectDatabase } from '@/utils/db'

interface RequestBody {
  content: string
  author: string
  post: string
  parentComment?: string
}

export const POST = async (request: NextRequest) => {
  const body: RequestBody = await request.json()

  const { author, content, post, parentComment } = body

  try {
    await connectDatabase()

    const newComment = new Comment({ author, content, post, parentComment })
    await newComment.save()

    // Update the parent comment - push the id of the reply into the replies array
    await Comment.findOneAndUpdate({ _id: parentComment }, { $push: { replies: newComment._id } }, { new: false })

    // Update array in the Post schema.
    await Post.findOneAndUpdate({ _id: post }, { $push: { comments: newComment._id } }, { new: false })

    // Update array in the User document.
    await User.findOneAndUpdate({ name: author }, { $push: { comments: newComment._id } }, { new: false })

    return new NextResponse(JSON.stringify(body), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ message: 'error' }), { status: 501 })
  }
}
