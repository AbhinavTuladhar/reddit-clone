'use client'

import React from 'react'
import axios from 'axios'
import useSWR from 'swr'
import Image from 'next/image'

interface PopularSubsType {
  name: string,
  members: number
}
const PopularCommunities = () => {
  const fetcher = (url: string) => axios.get(url).then(response => response.data)
  const { data } = useSWR<PopularSubsType[]>('/api/popular', fetcher)

  console.log(data)

  return (
    <div className='bg-reddit-dark border border-reddit-border rounded-lg flex flex-col'>
      <h1 className='text-reddit-placeholder-gray'> POPULAR COMMUNITIES </h1>
    </div>
  )
}

export default PopularCommunities