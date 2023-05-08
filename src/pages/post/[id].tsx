import { api } from '~/utils/api'
import Head from 'next/head'
import { PageLayout } from '~/components/layout'
import { PostView } from '~/components/postview'
import { generateSSGHelper } from '~/server/helpers/ssgHelper'
import type { GetStaticProps, NextPage } from 'next'

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  })

  if (!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const id = context.params?.id

  if (typeof id !== 'string') throw new Error('no id') // proper solution would be to return a different page

  await ssg.posts.getById.prefetch({ id })

  return {
    props: {
      trpcState: ssg.dehydrate(), // TL;DR: data is there when the page loads, so it's loading state will never be hit; takes all the  things we fetched and puts in a shape that can be parsed through nextjs serverside props (static props) and then on the app side we will hydrate all that data through react query into the page
      id,
    },
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' }
}

export default SinglePostPage
