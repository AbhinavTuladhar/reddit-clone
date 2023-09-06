import { NextResponse, NextRequest } from "next/server"
import { connectDatabase } from "@/utils/db"
import User from "@/models/User"
import bcrypt from 'bcryptjs'

export const POST = async (request: NextRequest) => {
  const { userName, email, password, bio } = await request.json()

  try {
    await connectDatabase()

    const hashedPassword = await bcrypt.hash(password, 5)

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      bio
    })

    newUser.save()

    console.log(newUser)

    return new NextResponse('User created', { status: 200 })
  } catch (error) {
    console.error(error)
    return new NextResponse('Unable to create user', { status: 500 })
  }

}