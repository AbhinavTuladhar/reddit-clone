'use client'

import React, { useState } from 'react'
import { CgArrowTopRightO } from 'react-icons/cg'
import { BsChatDots } from 'react-icons/bs'
import { VscBell } from 'react-icons/vsc'
import { AiOutlinePlus } from 'react-icons/ai'
import { IconType } from 'react-icons'
import { Tooltip } from 'react-tooltip'
import ModalWrapper from '@/hoc/ModalWrapper'
import SubCreationWindow from './SubCreationWindow'

interface IconProps {
  icon: IconType,
  className?: string
}

const IconGroup = () => {
  const [subCreationFlag, setSubCreationFlag] = useState(false)

  const handleModalView = () => {
    setSubCreationFlag(prevState => !prevState)
  }

  const className = 'h-8 w-8 hover:cursor-pointer hover:bg-reddit-hover-gray p-1'
  return (
    <>
      <ModalWrapper visibilityFlag={subCreationFlag} containerClassName='w-5/6'>
        <SubCreationWindow handleModalView={handleModalView} />
      </ModalWrapper>
      <div className='flex flex-row gap-x-1.5'>
        <CgArrowTopRightO id='createSub' className={`${className} hidden md:block`} onClick={handleModalView} />
        <BsChatDots id='chats' className={className} />
        <VscBell id='notifications' className={className} />
        <AiOutlinePlus id='createPost' className={className} />
      </div>
      <Tooltip anchorSelect="#createSub" place="bottom">
        Create subreddit
      </Tooltip>
      <Tooltip anchorSelect="#chats" place="bottom">
        Messages
      </Tooltip>
      <Tooltip anchorSelect="#notifications" place="bottom">
        Notifications
      </Tooltip>
      <Tooltip anchorSelect="#createPost" place="bottom">
        Create post
      </Tooltip>
    </>
  )
}

export default IconGroup