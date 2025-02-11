import React, { FC } from 'react'
import classNames from 'classnames'
import { PiCaretDown } from 'react-icons/pi'

import useSubredditList from '@/hooks/useSubredditList'
import useToggle from '@/hooks/useToggle'

interface SelectorProps {
  selectedSubreddit: string
  setSelectedSubreddit: (_sub: string) => void
}

export const SubredditSelector: FC<SelectorProps> = ({ selectedSubreddit, setSelectedSubreddit }) => {
  const { data, isLoading, isError } = useSubredditList()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <SubredditDropDown
      selectedSubreddit={selectedSubreddit}
      setSelectedSubreddit={setSelectedSubreddit}
      subredditList={data.map((row) => row.name)}
    />
  )
}

interface DropdownProps extends SelectorProps {
  subredditList: string[]
}

const SubredditDropDown: FC<DropdownProps> = ({ selectedSubreddit, setSelectedSubreddit, subredditList }) => {
  const { value: isOpen, toggleValue: toggleIsOpen } = useToggle(false)

  return (
    <div
      className="relative z-10 flex w-72 cursor-pointer items-center justify-between rounded-lg border-[1px] border-reddit-border bg-reddit-dark p-2"
      onClick={toggleIsOpen}
    >
      <span>{selectedSubreddit}</span>
      <PiCaretDown className={classNames('duration-300', { 'rotate-180': isOpen })} />
      {isOpen && (
        <div className="absolute right-0 top-9 mt-2 max-h-64 w-72 overflow-y-auto rounded-lg border border-reddit-border bg-reddit-dark">
          {subredditList.map((sub, index) => (
            <div
              className="relative z-50 border border-reddit-border p-2 text-sm hover:cursor-pointer hover:brightness-110"
              onClick={() => setSelectedSubreddit(sub)}
              key={index}
            >
              {sub}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
