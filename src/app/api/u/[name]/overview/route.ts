import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/utils/db";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

interface RequestParams {
  params: {
    name: string
  }
}

export const GET = async (request: NextRequest, params: RequestParams) => {
  const { params: { name } } = params
  const searchParams = request.nextUrl.searchParams
  const offset = request.nextUrl.searchParams.get('offset') || 0
  const limit = request.nextUrl.searchParams.get('limit') || 10

  const postOffset = Math.ceil(+offset / 2)
  const commentOffset = +offset - postOffset

  const postLimit = Math.ceil(+limit / 2)
  const commentLimit = +limit - postLimit

  try {
    await connectDatabase()

    const foundUser = await User.findOne(
      { name },
      {
        name: 1,
        // posts: { $slice: [+offset, +limit] },
        posts: 1,
        // comments: { $slice: [+offset, +limit] },
        comments: 1,
        upvotedPosts: 1,
        downvotedPosts: 1
      }
    )

    // This is the case for finding out the up and downvoted posts
    if (searchParams.get('voted') === 'yes') {
      const upvotedPostIds = foundUser.upvotedPosts.map((post: any) => post)
      const downvotedPostIds = foundUser.downvotedPosts.map((post: any) => post)

      const votedResponse = {
        upvotedIds: upvotedPostIds,
        downvotedIds: downvotedPostIds
      }

      return new NextResponse(JSON.stringify(votedResponse, null, 2), { status: 201 })
    }

    // Find all the posts and comments made by the user.
    const foundPosts = await Post.find(
      { _id: { $in: foundUser.posts } },
      { _id: 1, createdAt: 1 }
    ).sort({ createdAt: -1 }).skip(+offset).limit(+limit)
    const foundComments = await Comment.find(
      { _id: { $in: foundUser.comments } },
      { _id: 1, createdAt: 1, post: 1 }
    ).sort({ createdAt: -1 }).skip(+offset).limit(+limit)

    const postIdsOfCommentedPosts = foundComments.map(comment => comment.post)

    const postsCommentedIn = await Post.find(
      { _id: { $in: postIdsOfCommentedPosts } },
      { author: 1, subreddit: 1, title: 1, _id: 1 }
    )

    // This array of objects contains the comment id, and some details of the post.
    const properCommentData = foundComments.map(comment => {
      const obj1 = comment.toObject()
      const matchingObj = postsCommentedIn.find(post => {
        const obj = post.toObject()
        return obj1.post.toString() === obj._id.toString()
      })
      return {
        postAuthor: matchingObj.author, postSubreddit: matchingObj.subreddit, postTitle: matchingObj.title, postId: matchingObj._id,
        _id: obj1._id, createdAt: obj1.createdAt
      }
    })

    // Sort the posts AND comments by the creation date.
    const combinedArray = [
      ...foundPosts.map(post => ({ type: 'post', _id: post._id, createdAt: post.createdAt })),
      ...properCommentData.map(comment => ({
        type: 'comment', _id: comment._id, createdAt: comment.createdAt, postAuthor: comment.postAuthor,
        postSubreddit: comment.postSubreddit, postTitle: comment.postTitle, postId: comment.postId
      }))
    ]
    combinedArray.sort((a, b) => b.createdAt - a.createdAt);

    // Construct an object for overview, posts and comments, separately.
    const apiResponse = {
      posts: foundPosts,
      comments: properCommentData,
      overview: combinedArray
    }

    return new NextResponse(JSON.stringify(apiResponse, null, 2), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }

}