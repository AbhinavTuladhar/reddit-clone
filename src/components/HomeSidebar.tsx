import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Banner from '../images/home_banner.png'
import Snoo from '../images/Snoo.png'

const HomeSidebar = () => {
  return (
    <div className="flex flex-col rounded-lg border border-reddit-border">
      <Image src={Banner} alt="home banner" className="h-fit w-80" />
      <section className="flex flex-col gap-y-2 bg-reddit-dark px-2 pb-4">
        <div className="flex flex-row items-center gap-x-2">
          <Image src={Snoo} alt="Snoo" className="-mt-3 h-20 w-12" />
          <span className="font-bold"> Home </span>
        </div>
        <span className="whitespace-pre-wrap border-b border-reddit-placeholder-gray pb-2">
          Your personal Reddit frontpage. Come here to check in with your favourite communities.
        </span>
        <section className="mt-2 flex flex-col gap-y-4">
          <Link
            href="/submit"
            className="rounded-full bg-reddit-white py-1 text-center font-bold text-black duration-300 hover:brightness-90"
          >
            Create post
          </Link>
          <button className="rounded-full border border-reddit-white bg-reddit-gray py-1 font-bold text-reddit-white duration-300 hover:brightness-110">
            Create community
          </button>
        </section>
      </section>
    </div>
  )
}

export default HomeSidebar
