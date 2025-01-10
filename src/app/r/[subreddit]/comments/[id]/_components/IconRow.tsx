import React from 'react'
import { FaRegCommentAlt } from 'react-icons/fa'
import { FiGift } from 'react-icons/fi'
import { PiShareFatBold } from 'react-icons/pi'

interface IconRowProps {
  commentCount: number
}

export const IconRow: React.FC<IconRowProps> = ({ commentCount }) => {
  const iconClassName = 'text-reddit-placeholder-gray font-bold w-5 h-5'

  const iconBarData = [
    {
      icon: <FaRegCommentAlt className={iconClassName} />,
      label: `${commentCount} comments`,
    },
    { icon: <FiGift className={iconClassName} />, label: 'Award' },
    { icon: <PiShareFatBold className={iconClassName} />, label: 'Share' },
  ]
  return (
    <section className="flex flex-row gap-x-2">
      {iconBarData.map((row, index) => (
        <div
          className="flex flex-row items-center gap-x-2 p-2 duration-300 hover:cursor-pointer hover:bg-reddit-hover-gray"
          key={index}
        >
          <span> {row.icon} </span>
          <span className="text-reddit-placeholder-gray"> {row.label} </span>
        </div>
      ))}
    </section>
  )
}
