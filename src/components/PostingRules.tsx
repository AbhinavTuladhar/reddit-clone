import React from 'react'

const PostingRules = () => {
  const ruleList = [
    '1. Remember the human',
    '2. Behave like you would in real life',
    '3. Look for the original source of content',
    '4. Search for duplicates before posting',
    "5. Read the community's rules",
  ]

  const rowClassName = 'border-b-[1px] border-reddit-border text-sm py-3 px-3 flex items-center'

  return (
    <section className="mt-10 hidden rounded-lg bg-reddit-dark px-2 pb-2 pt-4 lg:flex lg:self-start">
      <div className="flex flex-col">
        <h1 className={`${rowClassName} px-3 text-xl font-bold`}>Posting to reddit</h1>
        {ruleList.map((rule, index) => (
          <div className={rowClassName} key={index}>
            {' '}
            {rule}{' '}
          </div>
        ))}
      </div>
    </section>
  )
}

export default PostingRules
