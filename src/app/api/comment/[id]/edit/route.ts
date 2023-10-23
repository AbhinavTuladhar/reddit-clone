import { NextRequest, NextResponse } from "next/server"
import { connectDatabase } from "@/utils/db"
import Comment from "@/models/Comment"
import User from "@/models/User"
import { voteStatus, VotingRequestBody, CommentType, CommentEditBody } from "@/types/types"
import { Schema } from "mongoose";

interface RequestParams {
  params: {
    id: string
  }
}

export const PATCH = async (request: NextRequest, params: RequestParams) => {
  const { params: { id } } = params
  const body: CommentEditBody = await request.json()
  const { content } = body

  try {
    await connectDatabase()
    const currentTime = new Date()
    const foundComment = await Comment.findOneAndUpdate({ _id: id }, { content: content, editedFlag: true, editedAt: currentTime })
    await foundComment.save()
    return new NextResponse(JSON.stringify(foundComment), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: error }), { status: 501 })
  }
}