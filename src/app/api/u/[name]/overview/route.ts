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
  const offset = request.nextUrl.searchParams.get('offset') || 0
  const limit = request.nextUrl.searchParams.get('limit') || 100

  try {
    await connectDatabase()

    const foundUser = await User.findOne(
      { name },
      {
        name: 1,
        posts: 1,
        comments: 1,
        upvotedPosts: 1,
        downvotedPosts: 1
      }
    )

    if (!foundUser) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 501 })
    }

    // Find all the posts and comments made by the user.
    const foundPosts = await Post.find(
      { _id: { $in: foundUser.posts } },
      { _id: 1, createdAt: 1 }
    ).sort({ createdAt: -1 })

    const foundComments = await Comment.find(
      { _id: { $in: foundUser.comments } },
      { _id: 1, createdAt: 1, post: 1 }
    ).sort({ createdAt: -1 })

    // Label the posts and comments for pagination purposes.
    const flaggedComments = foundComments.map(comment => ({
      type: 'comment',
      ...comment.toObject()
    }))

    const flaggedPosts = foundPosts.map(post => ({
      type: 'post',
      ...post.toObject()
    }))

    // Combine the posts and comments into one array, and then apply offset and limits.
    const combinedPostsComments = [...flaggedComments, ...flaggedPosts].sort((a, b) => a.createdAt < b.createdAt ? 1 : -1).slice(+offset, +offset + +limit)

    const foundCommentsNew = combinedPostsComments.filter(content => content.type === 'comment').map(comment => {
      const { ...rest } = comment
      return { ...rest }
    })

    const foundPostsNew = combinedPostsComments.filter(content => content.type === 'post').map(post => {
      const { ...rest } = post
      return { ...rest }
    })

    const postIdsOfCommentedPosts = foundCommentsNew.map(comment => {
      if ('post' in comment) {
        return comment.post
      }
    })

    const postsCommentedIn = await Post.find(
      { _id: { $in: postIdsOfCommentedPosts } },
      { author: 1, subreddit: 1, title: 1, _id: 1 }
    )

    // This array of objects contains the comment id, and some details of the post.
    const properCommentData = foundCommentsNew.map(obj1 => {
      const matchingObj = postsCommentedIn.find(obj => {
        if ('post' in obj1) {
          return obj1.post.toString() === obj._id.toString()
        }
      })

      if (!matchingObj) return {}

      return {
        postAuthor: matchingObj.author, postSubreddit: matchingObj.subreddit, postTitle: matchingObj.title, postId: matchingObj._id,
        _id: obj1._id, createdAt: obj1.createdAt
      }
    })

    // Sort the posts AND comments by the creation date.
    const combinedArray = [
      ...foundPostsNew.map(post => ({ type: 'post', _id: post._id, createdAt: post.createdAt })),
      ...properCommentData.map(comment => ({
        type: 'comment', _id: comment._id, createdAt: comment.createdAt, postAuthor: comment.postAuthor,
        postSubreddit: comment.postSubreddit, postTitle: comment.postTitle, postId: comment.postId
      }))
    ]

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    combinedArray.sort((a, b) => b.createdAt - a.createdAt);

    return new NextResponse(JSON.stringify(combinedArray, null, 2), { status: 201 })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error }), { status: 501 })
  }

}