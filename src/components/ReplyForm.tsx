import React from 'react'

interface ReplyFormProps {
  reply: string
  setReply: (value: string) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  toggleReplyVisibility: () => void
}

const ReplyForm: React.FC<ReplyFormProps> = ({ reply, setReply, handleSubmit, toggleReplyVisibility }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event
    setReply(value)
  }

  return (
    <form className="flex flex-1 flex-col gap-y-2" onSubmit={handleSubmit}>
      <textarea
        className="h-32 w-full resize-none border-[1px] border-reddit-border bg-reddit-dark px-4 py-2 placeholder:text-reddit-placeholder-gray"
        placeholder="What are your thoughts?"
        onChange={handleChange}
        value={reply}
      />
      <div className="-mt-1.5 flex flex-row justify-end gap-x-3 bg-reddit-gray px-2 py-1">
        <button
          className="rounded-full px-2 py-1 text-sm text-white hover:bg-reddit-hover-gray"
          onClick={() => toggleReplyVisibility()}
        >
          Cancel
        </button>
        <button
          className="rounded-full bg-white px-2 py-1 text-sm enabled:text-black disabled:text-gray-400 disabled:hover:cursor-not-allowed"
          disabled={reply === ''}
          type="submit"
        >
          Comment
        </button>
      </div>
    </form>
  )
}

export default ReplyForm
