import React from 'react'

interface ReplyFormProps {
  reply: string,
  setReply: (value: string) => void,
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  toggleReplyVisibility: () => void,
}

const ReplyForm: React.FC<ReplyFormProps> = ({ reply, setReply, handleSubmit, toggleReplyVisibility }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target: { value } } = event
    setReply(value)
  }

  return (
    <form className='flex flex-col flex-1 gap-y-2' onSubmit={handleSubmit}>
      <textarea
        className='w-full px-4 py-2 h-32 border-[1px] border-reddit-border bg-reddit-dark resize-none placeholder:text-reddit-placeholder-gray'
        placeholder='What are your thoughts?'
        onChange={handleChange}
        value={reply}
      />
      <div className='bg-reddit-gray -mt-1.5 px-2 py-1 flex flex-row gap-x-3 justify-end'>
        <button
          className='px-2 py-1 text-sm text-white rounded-full hover:bg-reddit-hover-gray'
          onClick={() => toggleReplyVisibility()}
        >
          Cancel
        </button>
        <button
          className='px-2 py-1 text-sm bg-white rounded-full disabled:text-gray-400 enabled:text-black disabled:hover:cursor-not-allowed'
          disabled={reply === ''}
          type='submit'
        >
          Comment
        </button>
      </div>
    </form>
  )
}

export default ReplyForm