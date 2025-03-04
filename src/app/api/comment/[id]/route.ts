// Get the information about the comment having id of [id]

import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'

import Comment from '@/models/Comment'
import User from '@/models/User'
import { VoteStatus, VotingRequestBody } from '@/types'
import { connectDatabase } from '@/utils/db'

interface RequestParams {
  params: {
    id: string
  }
}

export const GET = async (request: NextRequest, params: RequestParams) => {
  const {
    params: { id },
  } = params

  const userName = request.nextUrl.searchParams.get('userName') || ''

  try {
    await connectDatabase()

    const foundComment = await Comment.findOne({ _id: id })

    if (!foundComment) {
      return new NextResponse(JSON.stringify({ message: 'Comment not found!' }), { status: 501 })
    }

    const voteStatus: VoteStatus =
      foundComment.upvotedBy.includes(userName) || foundComment.author === userName
        ? 'upvoted'
        : foundComment.downvotedBy.includes(userName)
          ? 'downvoted'
          : 'nonvoted'

    const { upvotedBy: _upvote, downvotedBy: _downvote, ...commentData } = foundComment.toJSON()

    const finalCommentData = {
      ...commentData,
      voteStatus,
      effectiveKarma: foundComment.upvotedBy.length - foundComment.downvotedBy.length + 1,
    }

    return new NextResponse(JSON.stringify(finalCommentData), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }
}

export const PATCH = async (request: NextRequest, params: RequestParams) => {
  const {
    params: { id: commentId },
  } = params
  const body: VotingRequestBody = await request.json()

  const { user, voteTarget, author } = body

  try {
    await connectDatabase()

    // Find the comment
    const foundComment = await Comment.findById(commentId)

    if (!foundComment) {
      return new NextResponse(JSON.stringify({ message: 'Comment not found!' }), { status: 501 })
    }

    // Find the corresponding user
    const foundUser = await User.findOne({ name: user })

    if (!foundUser) {
      return new NextResponse(JSON.stringify({ message: 'User not found!' }), { status: 501 })
    }

    // Find the author of the comment to change their comment karma
    const commentAuthor = await User.findOne({ name: foundComment.author })

    if (!commentAuthor) {
      return new NextResponse(JSON.stringify({ message: 'Comment author not found!' }), { status: 501 })
    }

    // For the TS compiler

    // Do nothing if the comment author and the up/down voter is the same
    if (user === author) {
      /* empty */
    }

    // Case 4: Upvoted, click on downvote
    else if (foundComment.upvotedBy.includes(user) && voteTarget === 'downvoted') {
      foundComment.upvotedBy = foundComment.upvotedBy.filter((value: string) => value !== user)
      foundComment.downvotedBy.push(user)

      foundUser.upvotedComments = foundUser.upvotedComments.filter((value) => value.toString() !== commentId)
      foundUser.downvotedComments.push(new Types.ObjectId(commentId))

      // foundUser.upvotedComments = foundUser.upvotedComments.filter((value: Schema.Types.ObjectId) => value.toString() !== commentId)
      // foundUser.downvotedComments.push(commentId)

      commentAuthor.commentKarma -= 2
    }

    // Case 5: Downvoted, click on upvote
    else if (foundComment.downvotedBy.includes(user) && voteTarget === 'upvoted') {
      foundComment.downvotedBy = foundComment.downvotedBy.filter((value: string) => value !== user)
      foundComment.upvotedBy.push(user)

      foundUser.downvotedComments = foundUser.downvotedComments.filter((value) => value.toString() !== commentId)
      foundUser.upvotedComments.push(new Types.ObjectId(commentId))

      commentAuthor.commentKarma += 2
    }

    // Case 2: Upvoted, click upvote again.
    else if (foundComment.upvotedBy.includes(user)) {
      foundComment.upvotedBy = foundComment.upvotedBy.filter((value: string) => value !== user)
      foundUser.upvotedComments = foundUser.upvotedComments.filter((value) => value.toString() !== commentId)
      commentAuthor.commentKarma -= 1
    }

    // Case 3: Downvoted, click downvote again.
    else if (foundComment.downvotedBy.includes(user)) {
      foundComment.downvotedBy = foundComment.downvotedBy.filter((value: string) => value !== user)
      foundUser.downvotedComments = foundUser.downvotedComments.filter((value) => value.toString() !== commentId)
      commentAuthor.commentKarma += 1
    }

    // Case 1: not voted, change to up or down vote.
    else if (!foundComment.upvotedBy.includes(user) || !foundComment.downvotedBy.includes(user)) {
      if (voteTarget === 'upvoted') {
        foundComment.upvotedBy.push(user)
        foundUser.upvotedComments.push(new Types.ObjectId(commentId))
        commentAuthor.commentKarma += 1
      } else if (voteTarget === 'downvoted') {
        foundComment.downvotedBy.push(user)
        foundUser.downvotedComments.push(new Types.ObjectId(commentId))
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
