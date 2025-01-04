import { NextRequest, NextResponse } from 'next/server'

import Subreddit from '@/models/Subreddit'
import { SubDescChangeBody } from '@/types/types'
import { connectDatabase } from '@/utils/db'

interface RequestParams {
  params: {
    name: string
  }
}

export const GET = async (_request: NextRequest, params: RequestParams) => {
  const {
    params: { name },
  } = params

  try {
    await connectDatabase()

    const foundSubreddit = await Subreddit.findOne({ name })

    // console.log(foundSubreddit)
    return new NextResponse(JSON.stringify(foundSubreddit), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}

export const PATCH = async (request: NextRequest) => {
  const body: SubDescChangeBody = await request.json()

  const { name: subName, description } = body

  try {
    await connectDatabase()

    // Find the subreddit document
    const foundSubreddit = await Subreddit.findOneAndUpdate({ name: subName }, { description: description })

    if (!foundSubreddit) {
      return new NextResponse(JSON.stringify({ error: 'Subreddit not found' }), { status: 501 })
    }

    await foundSubreddit.save()

    return new NextResponse(JSON.stringify(foundSubreddit), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}
