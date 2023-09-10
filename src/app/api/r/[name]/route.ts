import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/utils/db";
import Subreddit from "@/models/Subreddit";

interface RequestParams {
  params: {
    name: string
  }
}

export const GET = async (_request: NextRequest, params: RequestParams) => {
  const { params: { name } } = params

  try {
    await connectDatabase()

    const foundSubreddit = await Subreddit.find({ name })

    // console.log(foundSubreddit)
    return new NextResponse(JSON.stringify(foundSubreddit), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}