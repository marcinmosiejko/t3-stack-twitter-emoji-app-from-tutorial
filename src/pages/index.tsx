import { api } from '~/utils/api'

import Image from 'next/image'
import { SignInButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { type NextPage } from 'next'
import { LoadingPage, LoadingSpinner } from '~/components/loading'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { PageLayout } from '~/components/layout'
import { PostView } from '~/components/postview'

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()

  const [input, setInput] = useState('') // better to use a form library like formik or react-hook-form

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput('')
      void ctx.posts.getAll.invalidate() // Invalidate the cache to refetch the posts
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error('Failed to post! Please try again later.')
      }
    },
  })

  if (!user) return null

  return (
    <div className="flex gap-5 h-20 items-center">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-10 w-10 rounded-full"
        width={32}
        height={32}
      />
      <input
        placeholder="Type some emojis!"
        className="bg-transparent grow outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (input !== '') {
              mutate({ content: input })
            }
          }
        }}
        disabled={isPosting}
      />
      <div className="flex justify-center  items-center">
        <button
          className={`${
            isPosting || input === '' ? 'text-slate-600' : 'text-slate-300'
          } `}
          onClick={() => mutate({ content: input })}
          disabled={isPosting || input === ''}
        >
          Post
        </button>

        {isPosting && <LoadingSpinner size={20} />}
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading) return <LoadingPage />

  if (!data)
    return (
      <div className="flex justify-center pt-6 text-slate-300">
        <div>Something went wrong</div>
      </div>
    )

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()
  // Start fetching asap so it's ready (stored in cache) once the user is loaded
  api.posts.getAll.useQuery()

  // return empty div if user isn't loaded yet (it happens fast so no point to show spinner)
  if (!userLoaded) return <div />

  return (
    <>
      <PageLayout>
        <div className="border-b border-slate-400 p-4">
          {!isSignedIn && <SignInButton />}
          {isSignedIn && <CreatePostWizard />}
          {/* {isSignedIn && <UserButton />} */}
        </div>
        <Feed />
      </PageLayout>
    </>
  )
}

export default Home
