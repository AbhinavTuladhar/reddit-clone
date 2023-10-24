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
  sameUser: boolean,
  voteStatus: voteStatus,
  effectiveKarma: number,
  handleVoteChange: (status: voteStatus) => void,
  toggleReplyVisibility: () => void,
  toggleEditing: () => void
}

const CommentActions: React.FC<CommentActionProps> = ({ sameUser, voteStatus, effectiveKarma, handleVoteChange, toggleReplyVisibility, toggleEditing }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  const baseIcons = [
    <IconWithText
      icon={<FiBookmark className='w-5 h-5' />}
      text='Save'
    />,
    <IconWithText
      icon={<BsFlag className='w-5 h-5' />}
      text='Report'
    />
  ]

  const ownCommentIcons = [
    <IconWithText
      icon={<SlPencil className='w-5 h-5' />}
      text='Edit'
      handleClick={() => {
        toggleMenu()
        toggleEditing()
      }}
    />,
    <IconWithText
      icon={<BsTrash className='w-5 h-5' />}
      text='Delete comment'
    />
  ]

  const baseIconClassName = 'flex flex-row items-center w-5 h-5 hover:cursor-pointer hover:bg-reddit-hover-gray duration-300'

  return (
    <div className='flex flex-row items-center gap-x-2'>
      <PiArrowFatUpFill
        className={classnames(
          baseIconClassName,
          { 'text-reddit-placeholder-gray': voteStatus !== 'upvoted' },
          { 'text-reddit-orange': voteStatus === 'upvoted' },
          'hover:text-reddit-orange'
        )}
        onClick={() => handleVoteChange('upvoted')}
      />
      <span
        className={classnames(
          'w-3 text-sm text-center',
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
          'hover:text-indigo-400'
        )}
        onClick={() => handleVoteChange('downvoted')}
      />
      <div
        className={`${baseIconClassName} w-fit px-2 py-4 flex flex-row items-center gap-x-2 text-reddit-placeholder-gray`}
        onClick={() => toggleReplyVisibility()}
      >
        <FaRegCommentAlt className='w-4 h-4' />
        <span className='text-sm'> Reply </span>
      </div>
      <div className='relative'>
        <div
          className={`${baseIconClassName} w-fit px-2 py-4 flex flex-row items-center gap-x-2 text-reddit-placeholder-gray`}
          onClick={toggleMenu}
        >
          <BsThreeDots className='w-4 h-4' />
        </div>
        <div className={` ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} absolute left-0 z-10 flex flex-col w-48 border shadow border-reddit-border shadow-reddit-white duration-300`}>
          {sameUser ? (
            [baseIcons[0], ...ownCommentIcons].map((icon, index) => (
              <div className='border border-reddit-border' key={index}>
                {icon}
              </div>
            ))
          ) : (
            baseIcons.map((icon, index) => (
              <div className="border border-reddit-border" key={index}>
                {icon}
              </div>
            ))
          )}
          {/* {userOptionData.map(icon => (
            <div className='flex flex-row items-center px-3 py-2 duration-300 border border-reddit-border bg-reddit-dark gap-x-2 hover:bg-reddit-dark-blue hover:cursor-pointer'>
              <> {icon.icon} </>
              <span> {icon.text}</span>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  )
}

export default CommentActions