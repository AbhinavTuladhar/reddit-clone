import { NextRequest, NextResponse } from 'next/server'

import User from '@/models/User'
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

    const foundUser = await User.findOne({ name })

    // console.log(foundUser)
    return new NextResponse(JSON.stringify(foundUser), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}
