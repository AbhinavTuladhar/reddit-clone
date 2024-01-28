import React from 'react'

const Loader = () => {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-slate-300 border-t-blue-600" />
      <span> Loading... </span>
    </div>
  )
}

export default Loader
