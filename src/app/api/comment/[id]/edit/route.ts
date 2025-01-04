import { NextRequest, NextResponse } from 'next/server'

import Comment from '@/models/Comment'
import { CommentEditBody } from '@/types/types'
import { connectDatabase } from '@/utils/db'

interface RequestParams {
  params: {
    id: string
  }
}

export const PATCH = async (request: NextRequest, params: RequestParams) => {
  const {
    params: { id },
  } = params
  const body: CommentEditBody = await request.json()
  const { content } = body

  try {
    await connectDatabase()
    const currentTime = new Date()
    const foundComment = await Comment.findOneAndUpdate(
      { _id: id },
      { content: content, editedFlag: true, editedAt: currentTime },
    )

    if (!foundComment) {
      return new NextResponse(JSON.stringify({ error: 'Comment mysteriously not found' }), { status: 501 })
    }

    await foundComment.save()
    return new NextResponse(JSON.stringify(foundComment), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: error }), { status: 501 })
  }
}
