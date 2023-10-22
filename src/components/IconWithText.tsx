import React from 'react'

interface IconProps {
  icon: React.ReactNode,
  extraClassName?: string,
  text: string | React.ReactNode
}

const IconWithText: React.FC<IconProps> = ({ icon, extraClassName, text }) => {
  return (
    <div className='flex flex-row items-center px-1 py-2 duration-200 gap-x-1 bg-reddit-dark text-reddit-placeholder-gray hover:bg-reddit-dark-blue hover:cursor-pointer hover:text-slate-100'>
      {icon}
      <span> {text} </span>
    </div>
  )
}

export default IconWithText