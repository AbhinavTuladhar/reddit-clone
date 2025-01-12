import React, { FC } from 'react'
import Link from 'next/link'

interface MetaDataProps {
  author: string
  postAuthor: string
  editedFlag: boolean
  dateString: string
  editedDateString: string
}

const MetaData: FC<MetaDataProps> = ({ author, postAuthor, editedFlag, dateString, editedDateString }) => {
  return (
    <div className="flex flex-row flex-wrap items-center gap-x-2 text-xs">
      <Link href={`/u/${author}`} className="font-bold tracking-tight hover:underline">
        {author}
      </Link>
      {postAuthor === author && <span className="font-bold text-blue-600"> OP </span>}
      <span className="text-reddit-placeholder-gray"> · </span>
      <span className="text-reddit-placeholder-gray"> {dateString} </span>
      {editedFlag && (
        <>
          <span className="text-reddit-placeholder-gray"> · </span>
          <span className="italic text-reddit-placeholder-gray"> {`edited ${editedDateString}`} </span>
        </>
      )}
    </div>
  )
}

export default MetaData
