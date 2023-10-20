import React from 'react'
import type { Metadata } from 'next'
import { PostType } from '@/types/types';

interface CommentParams {
  params: {
    id: string;
  }
}

interface CommentLayoutProps extends CommentParams {
  children: React.ReactNode
}

const getPostContent = async (postId: string) => {
  const siteUrl = process.env.SITE_URL

  if (!siteUrl) {
    throw new Error('Site url in .env file has not been configured!')
  }

  try {
    const url = `${siteUrl}//api/post/${postId}`
    const apiResponse = await fetch(url, { cache: 'force-cache' })
    const userData: PostType = await apiResponse.json()
    return userData
  } catch (error) {
    console.error('Error.')
  }
}

export const generateMetadata = async ({ params }: CommentParams) => {
  const postData = await getPostContent(params.id)
  return {
    title: `${postData?.title} - Reddit`,
  }
}

export default function RootLayout({ children }: CommentLayoutProps) {
  return (
    <>
      {children}
    </>
  )
}