import { NextRequest, NextResponse } from "next/server"
import { connectDatabase } from "@/utils/db"
import Post from "@/models/Post"

export const POST = async (request: NextRequest) => {
  const body = await request.json()
  const subredditName = request.nextUrl.searchParams.get('sub')

  console.log(subredditName)

  return new NextResponse(JSON.stringify({ subredditName }), { status: 201 })
}