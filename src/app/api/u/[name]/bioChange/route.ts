import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/utils/db";
import User from "@/models/User";
import { UserBioChangeBody } from "@/types/types";

export const PATCH = async (request: NextRequest) => {
  const requestBody: UserBioChangeBody = await request.json()

  const { bio, name: userName } = requestBody

  try {
    await connectDatabase()

    const foundUser = await User.findOneAndUpdate(
      { name: userName },
      { bio: bio }
    )

    if (!foundUser) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 501 })
    }

    await foundUser.save()

    return new NextResponse(JSON.stringify(foundUser), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}