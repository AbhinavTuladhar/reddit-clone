import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'

import Comment from '@/models/Comment'
import Post from '@/models/Post'
import User from '@/models/User'
import { VotingRequestBody } from '@/types/types'
import { connectDatabase } from '@/utils/db'

interface RequestParams {
  params: {
    id: string
  }
}

export const GET = async (_request: NextRequest, params: RequestParams) => {
  const {
    params: { id },
  } = params

  try {
    await connectDatabase()

    const foundPost = await Post.findOne({ _id: id })

    if (!foundPost) {
      return new NextResponse(JSON.stringify({ message: 'Post not found!' }), { status: 501 })
    }

    // Fetch the top-level comment IDs for the post
    const topLevelCommentsList = await Comment.find({ post: id, parentComment: null }, { _id: 1 })

    // Extract IDs from the query result
    const topLevelComments = topLevelCommentsList.map((comment) => comment._id)

    // Include the IDs in the post data
    const postWithTopLevelCommentIds = {
      ...foundPost.toJSON(),
      topLevelComments,
    }

    return new NextResponse(JSON.stringify(postWithTopLevelCommentIds), { status: 201 })
  } catch (error) {
    console.error('new error')
    return new NextResponse(JSON.stringify({ error: 'error!' }), { status: 501 })
  }
}

export const PATCH = async (request: NextRequest, params: RequestParams) => {
  const {
    params: { id: postId },
  } = params
  const body: VotingRequestBody = await request.json()

  const { user, voteTarget, author } = body

  try {
    await connectDatabase()

    // Find the post
    const foundPost = await Post.findById(postId)

    // Find the corresponding user
    const foundUser = await User.findOne({ name: user })

    // For the TS compiler
    if (!foundPost) {
      return new NextResponse(JSON.stringify({ message: 'Post not found!' }), { status: 501 })
    }

    if (!foundUser) {
      return new NextResponse(JSON.stringify({ message: 'User not found!' }), { status: 501 })
    }

    // Find the author of the post to change their post karma
    const postAuthor = await User.findOne({ name: foundPost.author })

    if (!postAuthor) {
      return new NextResponse(JSON.stringify({ message: 'Post author not found!' }), { status: 501 })
    }

    // Disable changing the vote count if the up/downvoer and the author of the post are the same,
    if (user === author) {
      /* empty */
    }

    // Case 2: Upvoted, click upvote again.
    else if (foundPost.upvotedBy.includes(user) && voteTarget === 'nonvoted') {
      foundPost.upvotedBy = foundPost.upvotedBy.filter((value: string) => value !== user)
      foundUser.upvotedPosts = foundUser.upvotedPosts.filter((value) => value.toString() !== postId)
      postAuthor.postKarma -= 1
    }

    // Case 3: Downvoted, click downvote again.
    else if (foundPost.downvotedBy.includes(user) && voteTarget === 'nonvoted') {
      foundPost.downvotedBy = foundPost.downvotedBy.filter((value: string) => value !== user)
      foundUser.downvotedPosts = foundUser.downvotedPosts.filter((value) => value.toString() !== postId)
      postAuthor.postKarma += 1
    }

    // Case 4: Upvoted, click on downvote
    else if (foundPost.upvotedBy.includes(user) && voteTarget === 'downvoted') {
      foundPost.upvotedBy = foundPost.upvotedBy.filter((value: string) => value !== user)
      foundPost.downvotedBy.push(user)

      foundUser.upvotedPosts = foundUser.upvotedPosts.filter((value) => value.toString() !== postId)
      foundUser.downvotedPosts.push(new Types.ObjectId(postId))

      postAuthor.postKarma -= 2
    }

    // Case 5: Downvoted, click on upvote
    else if (foundPost.downvotedBy.includes(user) && voteTarget === 'upvoted') {
      foundPost.downvotedBy = foundPost.downvotedBy.filter((value: string) => value !== user)
      foundPost.upvotedBy.push(user)

      foundUser.downvotedPosts = foundUser.downvotedPosts.filter((value) => value.toString() !== postId)
      foundUser.upvotedPosts.push(new Types.ObjectId(postId))

      postAuthor.postKarma += 2
    }

    // Case 1: not voted, change to up or down vote.
    else if (!foundPost.upvotedBy.includes(user) || !foundPost.downvotedBy.includes(user)) {
      if (voteTarget === 'upvoted') {
        foundPost.upvotedBy.push(user)
        foundUser.upvotedPosts.push(new Types.ObjectId(postId))
        postAuthor.postKarma += 1
      } else if (voteTarget === 'downvoted') {
        foundPost.downvotedBy.push(user)
        foundUser.downvotedPosts.push(new Types.ObjectId(postId))
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
