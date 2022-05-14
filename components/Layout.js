import Navigation from './Navigation'
import Head from 'next/head'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Wadaag APP</title>
        <meta property='og:title' content='Wadaag APP' key='title' />
      </Head>
      <Navigation />
      <main className='container py-2'>{children}</main>
      <Footer />
    </>
  )
}
