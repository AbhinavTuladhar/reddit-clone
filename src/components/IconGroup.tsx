'use client'

import React, { useState } from 'react'
import { CgArrowTopRightO } from 'react-icons/cg'
import { BsChatDots } from 'react-icons/bs'
import { VscBell } from 'react-icons/vsc'
import { AiOutlinePlus } from 'react-icons/ai'
import { IconType } from 'react-icons'
import SubCreationWindow from './SubCreationWindow'
import ModalWrapper from '@/hoc/ModalWrapper'

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
      <div className='flex flex-row gap-x-2'>
        <CgArrowTopRightO className={`${className} hidden md:block`} onClick={handleModalView} />
        <BsChatDots className={className} />
        <VscBell className={className} />
        <AiOutlinePlus className={className} />
      </div>
    </>
  )
}

export default IconGroup