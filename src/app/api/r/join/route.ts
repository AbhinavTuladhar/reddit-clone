import { NextRequest, NextResponse } from 'next/server'

import Subreddit from '@/models/Subreddit'
import User from '@/models/User'
import { JoinSubBody } from '@/types'
import { connectDatabase } from '@/utils/db'

export const PATCH = async (request: NextRequest) => {
  const body: JoinSubBody = await request.json()

  const { subreddit, userName } = body

  try {
    await connectDatabase()

    // Find the concerned user
    const foundUser = await User.findOne({ name: userName })

    // Find the concerned subreddit
    const foundSub = await Subreddit.findOne({ name: subreddit })

    // Worshipping the compiler
    if (!foundUser) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 501 })
    }

    if (!foundSub) {
      return new NextResponse(JSON.stringify({ error: 'Subreddit not found' }), { status: 501 })
    }

    // Check if the user has joined the sub.
    // If so remove the username from the Subreddit collection and the subreedit from UserNmae collection.
    if (foundUser.subscribedSubs.includes(subreddit)) {
      foundUser.subscribedSubs = foundUser.subscribedSubs.filter((sub: string) => sub !== subreddit)
      foundSub.subscribers = foundSub.subscribers.filter((user: string) => user !== userName)
    }

    // else push the subreddit and usernames into their respective arrays
    else {
      foundUser.subscribedSubs.push(subreddit)
      foundSub.subscribers.push(userName)
    }

    await foundUser.save()
    await foundSub.save()

    return new NextResponse(JSON.stringify({ message: 'Updated' }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 400 })
  }
}
