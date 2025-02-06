import React, { FC } from 'react'

const ContentRender: FC<{ content: string }> = ({ content }) => {
  const paragraphs = content.split('\n')

  return (
    <p>
      {paragraphs.map((part, index) => (
        <div key={index}>
          <span> {part} </span>
          <br />
        </div>
      ))}
    </p>
  )
}

export default ContentRender
