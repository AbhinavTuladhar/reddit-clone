// Get the information about the comment having id of [id]

import { NextRequest, NextResponse } from "next/server"
import { connectDatabase } from "@/utils/db"
import Comment from "@/models/Comment"

interface RequestParams {
  params: {
    id: string
  }
}

export const GET = async (request: NextRequest, params: RequestParams) => {
  const { params: { id } } = params

  try {
    await connectDatabase()

    const foundComment = await Comment.findOne({ _id: id })

    return new NextResponse(JSON.stringify(foundComment), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }

}