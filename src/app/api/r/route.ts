import { NextResponse, NextRequest } from "next/server"
import { connectDatabase } from "@/utils/db"
import Subreddit from "@/models/Subreddit"
import User from "@/models/User"
import { Document } from "mongodb"

export const POST = async (request: NextRequest) => {
  const body = await request.json()
  const { email = '', subredditName = '' } = body

  try {
    await connectDatabase()
    const matchedUser: Document | null = await User.findOne({ email: email })

    // Now creating the subreddit
    const newSub: Document = new Subreddit({
      name: subredditName,
      creator: matchedUser?.name
    })

    await newSub.save()

    return new NextResponse(JSON.stringify(body), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ message: 'error' }), { status: 501 })
  }
}

export const GET = async (request: NextRequest) => {
  // const email = request.nextUrl.searchParams.get('email') || ''

  const subsAndCreators = await Subreddit.find({}, { name: 1, creator: 1 })

  return new NextResponse(JSON.stringify(subsAndCreators), { status: 200 })
}