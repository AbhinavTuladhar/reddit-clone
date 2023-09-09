import React from 'react'

interface SubSelectorProps {
  subredditList: string[] | undefined,
  setSubSelectorOpen?: () => void,
  setSelectedSubreddit?: () => void,
}

const PostSubredditSelector: React.FC<SubSelectorProps> = ({ subredditList }) => {
  return (
    <div className='flex flex-col gap-y-4'>
      {subredditList?.map(row => (
        <p> {row} </p>
      ))}
    </div>
  )
}

export default PostSubredditSelector