import React from 'react'

const BorderDivider = () => {
  return (
    <div className="relative flex items-center py-5">
      <div className="flex-grow border-t border-gray-100"></div>
      <span className="flex-shrink mx-4 text-white"> OR </span>
      <div className="flex-grow border-t border-gray-100"></div>
    </div>
  )
}

export default BorderDivider