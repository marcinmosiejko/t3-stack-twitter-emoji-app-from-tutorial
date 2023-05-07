import { api } from '~/utils/api'
import Head from 'next/head'
import Image from 'next/image'
import { SignInButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { type NextPage } from 'next'
import { type RouterOutputs } from '~/utils/api'
import { LoadingPage } from '~/components/loading'

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()

  if (!user) return null

  return (
    <div className="flex gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-8 w-8 rounded-full"
        width={32}
        height={32}
      />
      <input
        placeholder="Type some emojis!"
        className="bg-transparent grow outline-none"
      />
    </div>
  )
}

type PostWithUser = RouterOutputs['posts']['getAll'][number]
const PostsView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <div
      key={post.id}
      className="border-b border-slate-400 p-4 flex gap-3 items-center"
    >
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        className="h-8 w-8 rounded-full"
        width={32}
        height={32}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-1">
          <span>{`@${author.username}`}</span>
          <span>·</span>
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading) return <LoadingPage />

  if (!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostsView {...fullPost} key={fullPost.post.id} />
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
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="border-b border-slate-400 p-4">
            {!isSignedIn && <SignInButton />}
            {isSignedIn && <CreatePostWizard />}
            {/* {user.isSignedIn && <UserButton />} */}
            <Feed />
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
