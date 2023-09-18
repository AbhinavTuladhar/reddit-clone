'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CgArrowTopRightO } from 'react-icons/cg'
import { BsChatDots } from 'react-icons/bs'
import { VscBell } from 'react-icons/vsc'
import { AiOutlinePlus } from 'react-icons/ai'
import { IconType } from 'react-icons'
import { Tooltip } from 'react-tooltip'
import ModalContainer from './ModalContainer'
import SubCreationWindow from './SubCreationWindow'

interface IconProps {
  mutateData: () => void
}

const IconGroup: React.FC<IconProps> = ({ mutateData }) => {
  const [subCreationFlag, setSubCreationFlag] = useState(false)

  const handleModalView = () => {
    setSubCreationFlag(prevState => !prevState)
  }

  const className = 'w-8 h-8 p-1 hover:cursor-pointer hover:bg-reddit-hover-gray'
  return (
    <>
      <ModalContainer visibilityFlag={subCreationFlag} containerClassName='w-5/6 mx-auto'>
        <SubCreationWindow handleModalView={handleModalView} mutateData={mutateData} />
      </ModalContainer>
      <div className='flex flex-row gap-x-1.5'>
        <CgArrowTopRightO id='createSub' className={className} onClick={handleModalView} />
        <BsChatDots id='chats' className={`${className} hidden md:block`} />
        <VscBell id='notifications' className={className} />
        <Link href='/submit'>
          <AiOutlinePlus id='createPost' className={className} />
        </Link>
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