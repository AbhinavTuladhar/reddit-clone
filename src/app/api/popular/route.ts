// An API endpoint for displaying the top 5 subreddits by the number of members.

import { NextResponse } from 'next/server'

import Subreddit from '@/models/Subreddit'
import { connectDatabase } from '@/utils/db'

export const GET = async () => {
  try {
    await connectDatabase()

    // Geth a list of the subs with most subscribers in descending order
    const topSubs = await Subreddit.aggregate([
      {
        $project: {
          members: { $size: '$subscribers' },
          name: 1,
          _id: 0,
        },
      },
      {
        $match: {
          members: { $gte: 1 },
        },
      },
      {
        $sort: { members: -1 },
      },
      {
        $limit: 5,
      },
    ])
    return new NextResponse(JSON.stringify(topSubs, null, 2), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}
