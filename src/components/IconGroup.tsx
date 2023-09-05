import React, { FC, ReactElement } from 'react'
import { CgArrowTopRightO } from 'react-icons/cg'
import { BsChatDots } from 'react-icons/bs'
import { VscBell } from 'react-icons/vsc'
import { AiOutlinePlus } from 'react-icons/ai'
import { IconType } from 'react-icons'

interface IconProps {
  icon: IconType,
  className?: string
}

// const CustomIcon: FC<IconProps> = ({ icon, className }) => {
//   return (
//     <span className={className}>
//       { icon }
//     </span>
//   )
// }

const IconGroup = () => {
  const className = 'h-8 w-8 hover:cursor-pointer hover:bg-reddit-hover-gray p-1'
  return (
    <div className='flex flex-row gap-x-2'>
      <CgArrowTopRightO className={`${className} hidden md:block`} />
      <BsChatDots className={className} />
      <VscBell className={className} />
      <AiOutlinePlus className={className} />
    </div>
  )
}

export default IconGroup