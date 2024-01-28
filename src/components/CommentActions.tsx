'use client'

import React, { useState } from 'react'
import { voteStatus } from '@/types/types'
import { BsThreeDots, BsTrash } from 'react-icons/bs'
import { SlPencil } from 'react-icons/sl'
import { PiArrowFatUpFill, PiArrowFatDownFill } from 'react-icons/pi'
import classnames from 'classnames'
import { FaRegCommentAlt } from 'react-icons/fa'
import { FiBookmark } from 'react-icons/fi'
import { BsFlag } from 'react-icons/bs'
import IconWithText from './IconWithText'

interface CommentActionProps {
  sameUser: boolean
  voteStatus: voteStatus
  effectiveKarma: number
  handleVoteChange: (status: voteStatus) => void
  toggleReplyVisibility: () => void
  toggleEditing: () => void
}

const CommentActions: React.FC<CommentActionProps> = ({
  sameUser,
  voteStatus,
  effectiveKarma,
  handleVoteChange,
  toggleReplyVisibility,
  toggleEditing,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState)
  }

  const baseIcons = [
    <IconWithText icon={<FiBookmark className="h-5 w-5" />} text="Save" key={1} />,
    <IconWithText icon={<BsFlag className="h-5 w-5" />} text="Report" key={2} />,
  ]

  const ownCommentIcons = [
    <IconWithText
      icon={<SlPencil className="h-5 w-5" />}
      text="Edit"
      key={3}
      handleClick={() => {
        toggleMenu()
        toggleEditing()
      }}
    />,
    <IconWithText icon={<BsTrash className="h-5 w-5" />} text="Delete comment" key={4} />,
  ]

  const baseIconClassName =
    'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray duration-300'

  return (
    <div className="flex flex-row items-center gap-x-2">
      <PiArrowFatUpFill
        className={classnames(
          baseIconClassName,
          { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
          { 'text-reddit-orange': voteStatus === 'upvoted' },
          'hover:text-reddit-orange',
        )}
        onClick={() => handleVoteChange('upvoted')}
      />
      <span
        className={classnames(
          'w-3 text-center text-sm',
          { 'text-reddit-placeholder-gray': voteStatus === 'nonvoted' },
          { 'text-reddit-orange': voteStatus === 'upvoted' },
          { 'text-indigo-400': voteStatus === 'downvoted' },
        )}
      >
        {effectiveKarma}
      </span>
      <PiArrowFatDownFill
        className={classnames(
          baseIconClassName,
          { 'text-reddit-placeholder-gray': voteStatus !== 'downvoted' },
          { 'text-indigo-400': voteStatus === 'downvoted' },
          'hover:text-indigo-400',
        )}
        onClick={() => handleVoteChange('downvoted')}
      />
      <div
        className={`${baseIconClassName} flex w-fit flex-row items-center gap-x-2 px-2 py-4 text-reddit-placeholder-gray`}
        onClick={() => toggleReplyVisibility()}
      >
        <FaRegCommentAlt className="h-4 w-4" />
        <span className="text-sm"> Reply </span>
      </div>
      <div className="relative">
        <div
          className={`${baseIconClassName} flex w-fit flex-row items-center gap-x-2 px-2 py-4 text-reddit-placeholder-gray`}
          onClick={toggleMenu}
        >
          <BsThreeDots className="h-4 w-4" />
        </div>
        <div
          className={` ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'} absolute left-0 z-10 flex w-48 flex-col border border-reddit-border shadow shadow-reddit-white duration-300`}
        >
          {sameUser
            ? [baseIcons[0], ...ownCommentIcons].map((icon, index) => (
                <div className="border border-reddit-border" key={index}>
                  {icon}
                </div>
              ))
            : baseIcons.map((icon, index) => (
                <div className="border border-reddit-border" key={index}>
                  {icon}
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}

export default CommentActions
