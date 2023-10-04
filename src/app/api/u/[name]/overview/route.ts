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

export const GET = async (_request: NextRequest, params: RequestParams) => {
  const { params: { name } } = params

  try {
    await connectDatabase()

    const foundUser = await User.findOne({ name }, { name: 1, posts: 1, comments: 1 })

    // Find all the posts and comments made by the user.
    const foundPosts = await Post.find(
      { _id: { $in: foundUser.posts } },
      { _id: 1, createdAt: 1 }
    ).sort({ createdAt: -1 })
    const foundComments = await Comment.find(
      { _id: { $in: foundUser.comments } },
      { _id: 1, createdAt: 1, post: 1 }
    ).sort({ createdAt: -1 })

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
        type: 'comment', _id: comment._id, createdAt: comment.createdAt,
        postAuthor: comment.postAuthor, postSubreddit: comment.postSubreddit, postTitle: comment.postTitle, postId: comment.postId
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