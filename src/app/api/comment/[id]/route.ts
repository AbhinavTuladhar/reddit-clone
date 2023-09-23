// Get the information about the comment having id of [id]

import { NextRequest, NextResponse } from "next/server"
import { connectDatabase } from "@/utils/db"
import Comment from "@/models/Comment"
import User from "@/models/User"
import { voteStatus, VotingRequestBody, CommentType } from "@/types/types"
import { Schema } from "mongoose";

interface RequestParams {
  params: {
    id: string
  }
}

export const GET = async (request: NextRequest, params: RequestParams) => {
  const { params: { id } } = params

  try {
    await connectDatabase()

    const foundComment = await Comment.findOne({ _id: id })

    return new NextResponse(JSON.stringify(foundComment), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }
}

export const PATCH = async (request: NextRequest, params: RequestParams) => {
  const { params: { id: commentId } } = params
  const body: VotingRequestBody = await request.json()

  const { user, voteTarget, author } = body

  try {
    await connectDatabase()

    // Find the comment
    const foundComment = await Comment.findById(commentId)

    // Find the corresponding user
    const foundUser = await User.findOne({ name: user })

    // Find the author of the comment to change their comment karma
    const commentAuthor = await User.findOne({ name: foundComment.author })

    // For the TS compiler
    if (!foundComment) {
      return new NextResponse(JSON.stringify({ message: 'Comment not found!' }), { status: 501 })
    }

    // Do nothing if the comment author and the up/down voter is the same
    if (user === author) { }

    // Case 4: Upvoted, click on downvote
    else if ((foundComment.upvotedBy.includes(user)) && voteTarget === 'downvoted') {
      foundComment.upvotedBy = foundComment.upvotedBy.filter((value: string) => value !== user)
      foundComment.downvotedBy.push(user)

      foundUser.upvotedComments = foundUser.upvotedComments.filter((value: Schema.Types.ObjectId) => value.toString() !== commentId)
      foundUser.downvotedComments.push(commentId)

      commentAuthor.commentKarma -= 2
    }

    // Case 5: Downvoted, click on upvote
    else if ((foundComment.downvotedBy.includes(user)) && voteTarget === 'upvoted') {
      foundComment.downvotedBy = foundComment.downvotedBy.filter((value: string) => value !== user)
      foundComment.upvotedBy.push(user)

      foundUser.downvotedComments = foundUser.downvotedComments.filter((value: Schema.Types.ObjectId) => value.toString() !== commentId)
      foundUser.upvotedComments.push(commentId)

      commentAuthor.commentKarma += 2
    }

    // Case 2: Upvoted, click upvote again.
    else if (foundComment.upvotedBy.includes(user)) {
      foundComment.upvotedBy = foundComment.upvotedBy.filter((value: string) => value !== user)
      foundUser.upvotedComments = foundUser.upvotedComments.filter((value: Schema.Types.ObjectId) => value.toString() !== commentId)
      commentAuthor.commentKarma -= 1
    }

    // Case 3: Downvoted, click downvote again.
    else if (foundComment.downvotedBy.includes(user)) {
      foundComment.downvotedBy = foundComment.downvotedBy.filter((value: string) => value !== user)
      foundUser.downvotedComments = foundUser.downvotedComments.filter((value: Schema.Types.ObjectId) => value.toString() !== commentId)
      commentAuthor.commentKarma += 1
    }

    // Case 1: not voted, change to up or down vote.
    else if ((!foundComment.upvotedBy.includes(user)) || (!foundComment.downvotedBy.includes(user))) {
      if (voteTarget === 'upvoted') {
        foundComment.upvotedBy.push(user)
        foundUser.upvotedComments.push(commentId)
        commentAuthor.commentKarma += 1
      } else if (voteTarget === 'downvoted') {
        foundComment.downvotedBy.push(user)
        foundUser.downvotedComments.push(commentId)
        commentAuthor.commentKarma -= 1
      }
    }

    await foundComment.save()
    await foundUser.save()
    await commentAuthor.save()

    return new NextResponse(JSON.stringify(foundComment), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }
}