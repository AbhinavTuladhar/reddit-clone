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
  const className = 'h-6 w-6 hover:cursor-pointer'
  return (
    <div className='flex flex-row gap-x-4'>
      <CgArrowTopRightO className={className} />
      <BsChatDots className={className} />
      <VscBell className={className} />
      <AiOutlinePlus className={className} />
    </div>
  )
}

export default IconGroup