import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/utils/db";
import User from "@/models/User";
import { UserBioChangeBody } from "@/types/types";

interface RequestParams {
  params: {
    name: string
  }
}

export const PATCH = async (request: NextRequest, params: RequestParams) => {
  const { params: { name } } = params
  const requestBody: UserBioChangeBody = await request.json()

  const { bio, name: userName } = requestBody

  try {
    await connectDatabase()

    const foundUser = await User.findOneAndUpdate(
      { name: userName },
      { bio: bio }
    )

    await foundUser.save()

    return new NextResponse(JSON.stringify(foundUser), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }
}