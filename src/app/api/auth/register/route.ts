import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import User from '@/models/User'
import { connectDatabase } from '@/utils/db'

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json()

  try {
    await connectDatabase()

    const hashedPassword = await bcrypt.hash(password, 5)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    })

    newUser.save()

    // console.log(newUser)

    return new NextResponse('User created', { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse('Unable to create user', { status: 501 })
  }
}
