import React from 'react'

interface IconProps {
  icon: React.ReactNode
  extraClassName?: string
  text: string | React.ReactNode
  handleClick?: () => void
}

const IconWithText: React.FC<IconProps> = ({ icon, text, handleClick }) => {
  return (
    <div
      className="flex flex-row items-center gap-x-1 bg-reddit-dark px-1 py-2 text-reddit-placeholder-gray duration-200 hover:cursor-pointer hover:bg-reddit-dark-blue hover:text-slate-100"
      onClick={handleClick}
    >
      {icon}
      <span> {text} </span>
    </div>
  )
}

export default IconWithText
