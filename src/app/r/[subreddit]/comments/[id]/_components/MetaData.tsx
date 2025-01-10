import React from 'react'
import Link from 'next/link'

import calculateDateString from '@/utils/calculateDateString'

interface MetaDataProps {
  createdAt: string | Date
  subreddit: string
  author: string
}

export const MetaData: React.FC<MetaDataProps> = ({ createdAt, subreddit, author }) => {
  const dateString = calculateDateString(new Date(createdAt), new Date())

  return (
    <div className="flex flex-row flex-wrap items-center gap-x-1 text-xs text-gray-400">
      <Link className="font-bold text-white duration-300 hover:underline" href={`/r/${subreddit}`}>
        {' '}
        {`r/${subreddit}`}
      </Link>
      <span> Posted by </span>
      <Link href={`/u/${author}`} className="duration-300 hover:underline">
        {' '}
        {`u/${author}`}{' '}
      </Link>
      <span> {dateString} </span>
    </div>
  )
}
