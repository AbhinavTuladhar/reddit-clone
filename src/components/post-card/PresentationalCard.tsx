'use client'

import { FC } from 'react'
import Link from 'next/link'
import { Types } from 'mongoose'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { BsFlag, BsThreeDots } from 'react-icons/bs'
import { FaRegCommentAlt } from 'react-icons/fa'
import { FiBookmark } from 'react-icons/fi'
import { PiShareFatBold } from 'react-icons/pi'

import useToggle from '@/hooks/useToggle'
import { PostTypeNew } from '@/types'
import calculateDateString from '@/utils/calculateDateString'

import IconWithText from '../IconWithText'
import PostVoteArrows from '../post-vote-arrows'

const rowIconClassName = 'h-4 w-4'

const extraRowIcons = [
  <IconWithText icon={<FiBookmark className={rowIconClassName} />} text="Save" key={1} />,
  <IconWithText icon={<AiOutlineEyeInvisible className={rowIconClassName} />} text="Hide" key={2} />,
  <IconWithText icon={<BsFlag className={rowIconClassName} />} text="Report" key={3} />,
]

interface CardProps {
  postId: Types.ObjectId
  postData: PostTypeNew
  refetch: () => void
  subViewFlag?: boolean
}

const PresentationalCard: FC<CardProps> = ({ postData, postId, refetch, subViewFlag = false }) => {
  const { author, subreddit, title, createdAt, comments, voteStatus, effectiveKarma } = postData

  const { value: isMenuOpen, toggleValue: toggleMenu } = useToggle(false)

  const postLink = `/r/${subreddit}/comments/${postId}`
  const dateString = calculateDateString(new Date(createdAt), new Date())

  return (
    <article className="flex cursor-pointer flex-row items-center gap-x-4 border border-reddit-border bg-reddit-dark duration-150 hover:border-white">
      <div className="hidden bg-[#161617] p-4 md:block">
        <PostVoteArrows
          postId={postId}
          author={author}
          initialVoteStatus={voteStatus}
          effectiveKarma={effectiveKarma}
          refetch={refetch}
          resourceType="post"
        />
      </div>

      <div className="flex flex-1 flex-grow flex-col justify-between gap-y-1 py-1 pl-4 sm:pl-0">
        <Link href={postLink} className="flex w-full flex-grow flex-col justify-between gap-y-0">
          <h1 className="text-lg">{title}</h1>
          <div className="flex flex-row flex-wrap items-center gap-x-1 text-xs">
            {subViewFlag && (
              <Link href={`/r/${subreddit}`} className="font-bold hover:underline">
                {' '}
                {`r/${subreddit}`}{' '}
              </Link>
            )}
            <span className="flex flex-row text-gray-400">
              <span> Posted by&nbsp; </span>
              <Link href={`/u/${author}`} className="hover:underline">
                {' '}
                {`u/${author}`}
              </Link>
            </span>
            <span className="text-reddit-placeholder-gray"> {dateString} </span>
          </div>
        </Link>

        <div className="flex flex-row flex-wrap items-center gap-x-1">
          <div className="block md:hidden">
            <PostVoteArrows
              postId={postId}
              author={author}
              initialVoteStatus={voteStatus}
              effectiveKarma={effectiveKarma}
              refetch={refetch}
              resourceType="post"
            />
          </div>
          <IconWithText
            icon={<FaRegCommentAlt className={rowIconClassName} />}
            text={<Link href={postLink}>{`${comments?.length} comments`}</Link>}
          />
          <IconWithText icon={<PiShareFatBold className={rowIconClassName} />} text="Share" />
          <div className="hidden sm:flex sm:flex-row sm:gap-x-1">
            {extraRowIcons.map((icon, index) => (
              <div key={index}>{icon}</div>
            ))}
          </div>
          <div className="relative">
            <div
              className="block px-1 text-reddit-placeholder-gray duration-200 hover:cursor-pointer hover:bg-reddit-hover-gray sm:hidden"
              onClick={toggleMenu}
            >
              <BsThreeDots className={rowIconClassName} />
            </div>
            <div
              className={`${isMenuOpen ? 'opacity-100' : 'pointer-events-none  opacity-0'} absolute left-0 z-10 flex w-32 flex-col border border-reddit-border shadow shadow-reddit-white transition-opacity duration-300`}
            >
              {extraRowIcons.map((icon, index) => (
                <div className="border border-reddit-border" key={index}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PresentationalCard
