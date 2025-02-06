'use client'

import React, { FC, useState } from 'react'

interface SubredditDescriptionProps {
  initialDescription: string
}

export const SubredditDescription: FC<SubredditDescriptionProps> = ({ initialDescription }) => {
  const [description, setDescription] = useState(initialDescription)
  const [isEditing, setIsEditing] = useState(false)
  const [charactersRemaining, setCharactersRemaining] = useState(500)

  const descriptionParts = description.split('\n')

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event
    if (description.length <= 500) {
      setDescription(value)
    }
  }

  return <div>SubredditDescription</div>
}
