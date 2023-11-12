import React from 'react'

const Loader = () => {
  return (
    <div className='flex flex-row items-center gap-x-2'>
      <div className='w-8 h-8 border-4 border-t-4 rounded-full border-slate-300 border-t-blue-600 animate-spin' />
      <span> Loading... </span>
    </div>
  )
}

export default Loader