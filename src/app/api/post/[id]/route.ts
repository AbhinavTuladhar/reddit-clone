import { NextRequest, NextResponse } from "next/server"
import { connectDatabase } from "@/utils/db"
import Post from "@/models/Post"
import Subreddit from "@/models/Subreddit"
import User from "@/models/User"
import { VotingRequestBody } from "@/types/types"
import { Schema } from "mongoose";

interface RequestParams {
  params: {
    id: string
  }
}

export const GET = async (_request: NextRequest, params: RequestParams) => {
  const { params: { id } } = params

  try {
    await connectDatabase()

    const foundPost = await Post.findOne({ _id: id })

    return new NextResponse(JSON.stringify(foundPost), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }
}

export const PATCH = async (request: NextRequest, params: RequestParams) => {
  const { params: { id: postId } } = params
  const body: VotingRequestBody = await request.json()

  const { user, voteTarget } = body

  try {
    await connectDatabase()

    // Find the post
    const foundPost = await Post.findById(postId)

    // Find the corresponding user
    const foundUser = await User.findOne({ name: user })

    // Find the author of the post to change their post karma
    const postAuthor = await User.findOne({ name: foundPost.author })

    // For the TS compiler
    if (!foundPost) {
      return new NextResponse(JSON.stringify({ message: 'Post not found!' }), { status: 501 })
    }

    // Case 2: Upvoted, click upvote again.
    if (foundPost.upvotedBy.includes(user) && voteTarget === 'nonvoted') {
      foundPost.upvotedBy = foundPost.upvotedBy.filter((value: string) => value !== user)
      foundUser.upvotedPosts = foundUser.upvotedPosts.filter((value: Schema.Types.ObjectId) => value.toString() !== postId)
      postAuthor.postKarma -= 1
    }

    // Case 3: Downvoted, click downvote again.
    else if (foundPost.downvotedBy.includes(user) && voteTarget === 'nonvoted') {
      foundPost.downvotedBy = foundPost.downvotedBy.filter((value: string) => value !== user)
      foundUser.downvotedPosts = foundUser.downvotedPosts.filter((value: Schema.Types.ObjectId) => value.toString() !== postId)
      postAuthor.postKarma += 1
    }

    // Case 4: Upvoted, click on downvote
    else if ((foundPost.upvotedBy.includes(user)) && voteTarget === 'downvoted') {
      foundPost.upvotedBy = foundPost.upvotedBy.filter((value: string) => value !== user)
      foundPost.downvotedBy.push(user)

      foundUser.upvotedPosts = foundUser.upvotedPosts.filter((value: Schema.Types.ObjectId) => value.toString() !== postId)
      foundUser.downvotedPosts.push(postId)

      postAuthor.postKarma -= 2
    }

    // Case 5: Downvoted, click on upvote
    else if ((foundPost.downvotedBy.includes(user)) && voteTarget === 'upvoted') {
      foundPost.downvotedBy = foundPost.downvotedBy.filter((value: string) => value !== user)
      foundPost.upvotedBy.push(user)

      foundUser.downvotedPosts = foundUser.downvotedPosts.filter((value: Schema.Types.ObjectId) => value.toString() !== postId)
      foundUser.upvotedPosts.push(postId)

      postAuthor.postKarma += 2
    }

    // Case 1: not voted, change to up or down vote.
    else if ((!foundPost.upvotedBy.includes(user)) || (!foundPost.downvotedBy.includes(user))) {
      if (voteTarget === 'upvoted') {
        foundPost.upvotedBy.push(user)
        foundUser.upvotedPosts.push(postId)
        postAuthor.postKarma += 1
      } else if (voteTarget === 'downvoted') {
        foundPost.downvotedBy.push(user)
        foundUser.downvotedPosts.push(postId)
        postAuthor.postKarma -= 1
      }
    }

    await foundPost.save()
    await foundUser.save()
    await postAuthor.save()

    return new NextResponse(JSON.stringify(foundPost), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }
}