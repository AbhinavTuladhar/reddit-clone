import React from 'react'
import type { Metadata } from 'next'

interface SubredditParams {
  params: {
    subreddit: string;
  }
}

interface SubredditLayoutProps extends SubredditParams {
  children: React.ReactNode
}

export const generateMetadata = ({ params }: SubredditParams): Metadata => {
  return {
    title: `r/${params.subreddit} - Reddit`,
  }
}

export default function RootLayout({ children }: SubredditLayoutProps) {
  return (
    <>
      {children}
    </>
  )
}