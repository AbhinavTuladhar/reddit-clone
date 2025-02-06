import React, { FC } from 'react'
import Image from 'next/image'

import SubIcon from '@/images/subreddit_icon.png'
import formatSubName from '@/utils/formatSubName'

import { SubredditJoinButton } from './SubredditJoinButton'

interface HeaderProps {
  subredditName: string
}

export const SubredditHeader: FC<HeaderProps> = ({ subredditName }) => {
  const formattedName = formatSubName(subredditName)

  return (
    <>
      <div className="box-border h-20 w-full bg-reddit-blue"> </div>
      <section className="-ml-0 flex w-full flex-row gap-x-2 bg-reddit-gray pl-6">
        <Image src={SubIcon} className="mt-0 h-16 w-16 rounded-full border-4 sm:-mt-5 sm:h-20 sm:w-20" alt="sub icon" />
        <div className="my-1 flex flex-1 flex-col justify-center gap-y-1">
          <div className="flex flex-row flex-wrap items-center justify-between gap-4 sm:justify-start">
            <h1 className="hidden text-2xl font-bold sm:block">{formattedName}</h1>
            <small className="block text-base font-bold sm:hidden">{`r/${subredditName}`}</small>
            <SubredditJoinButton subredditName={subredditName} />
          </div>
          <small className="hidden text-base font-bold sm:block">{`r/${subredditName}`}</small>
        </div>
      </section>
    </>
  )
}
