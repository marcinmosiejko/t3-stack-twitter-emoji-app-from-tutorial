import { api } from '~/utils/api'
import Head from 'next/head'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { type NextPage } from 'next'
import { type RouterOutputs } from '~/utils/api'
import { LoadingPage, LoadingSpinner } from '~/components/loading'
import { useState } from 'react'
import toast from 'react-hot-toast'

dayjs.extend(relativeTime)

const SinglePostPage: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()
  // Start fetching asap so it's ready (stored in cache) once the user is loaded
  api.posts.getAll.useQuery()

  // return empty div if user isn't loaded yet (it happens fast so no point to show spinner)
  if (!userLoaded) return <div />

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">Post View</main>
    </>
  )
}

export default SinglePostPage
