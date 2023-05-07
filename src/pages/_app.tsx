import { type AppType } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'

import { api } from '~/utils/api'

import '~/styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    // head will be rendered on every page but overrideable by individual pages
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Chirp</title>
        <meta
          name="description"
          content="emoji twitter alternative done with t3-stack-tutorial"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
